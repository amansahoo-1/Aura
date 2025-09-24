// client/prismaClient.js

import { PrismaClient } from "@prisma/client";

// === 🔧 Configuration Constants ===
const isDev = process.env.NODE_ENV === "development";
const LOCAL_DB = process.env.DATABASE_URL_LOCAL;
const PROD_DB = process.env.DATABASE_URL;

const CONNECTION_TIMEOUT = 15;
const POOL_TIMEOUT = 10;
const CONNECTION_LIMIT = 5;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2500;
const HEALTH_CHECK_INTERVAL = 300_000;

// === 🌐 Determine DB URL Based on Environment ===
let dbUrl = null;
let dbLabel = null;

if (isDev && LOCAL_DB) {
  dbUrl = LOCAL_DB;
  dbLabel = "Local PostgreSQL";
} else if (!isDev && PROD_DB) {
  dbUrl = `${PROD_DB}&connect_timeout=${CONNECTION_TIMEOUT}&pool_timeout=${POOL_TIMEOUT}&connection_limit=${CONNECTION_LIMIT}&pgbouncer=true&max_idle_time=10000`;
  dbLabel = "Neon PostgreSQL";
} else if (PROD_DB) {
  // fallback: dev env but no local DB, use prod
  dbUrl = `${PROD_DB}&connect_timeout=${CONNECTION_TIMEOUT}&pool_timeout=${POOL_TIMEOUT}&connection_limit=${CONNECTION_LIMIT}&pgbouncer=true&max_idle_time=10000`;
  dbLabel = "Neon PostgreSQL (Fallback)";
} else {
  console.error("❌ DATABASE_URL is not set. Check your .env file.");
  process.exit(1);
}

// === 🧠 Debug
console.log(`📦 Using Database: ${dbLabel}`);

// === 🧱 Prisma Client Singleton ===
const prisma = new PrismaClient({
  log: [isDev ? "query" : "warn", "info", "warn", "error"],
  datasources: { db: { url: dbUrl } },
  __internal: {
    engine: {
      enableConnectionPooling: true,
      allowExitOnIdle: true,
    },
  },
});

// === 🔁 Retry-Aware Connection Lifecycle ===
let isConnected = false;
let connectionRetries = 0;

export async function ensureConnection() {
  if (isConnected) return prisma;

  try {
    await prisma.$connect();
    isConnected = true;
    connectionRetries = 0;
    console.log(`✅ Prisma connected to ${dbLabel}`);
    return prisma;
  } catch (error) {
    const attempt = ++connectionRetries;
    console.error(
      `❌ Prisma connection attempt ${attempt}/${MAX_RETRIES} failed`,
      error
    );

    if (attempt < MAX_RETRIES) {
      const delay = Math.min(RETRY_DELAY_MS * 2 ** (attempt - 1), 30_000);
      await new Promise((res) => setTimeout(res, delay));
      return ensureConnection();
    }

    console.error("💥 Max retries reached. Could not connect to DB.");
    throw new Error("Database connection failed.");
  }
}

// === 🔍 Health Checker ===
export async function checkNeonConnection() {
  try {
    await prisma.user.findFirst({ select: { id: true } });
    return true;
  } catch (error) {
    console.error("🧨 Prisma health check failed:", error);
    return false;
  }
}

// === 🚪 Graceful Shutdown ===
["beforeExit", "SIGINT", "SIGTERM", "SIGUSR2"].forEach((event) => {
  process.on(event, async () => {
    if (!isConnected) return;
    try {
      await prisma.$disconnect();
      isConnected = false;
      console.log("🔒 Prisma disconnected gracefully");
    } catch (err) {
      console.error("❌ Error during shutdown:", err);
    } finally {
      if (["SIGINT", "SIGTERM"].includes(event)) process.exit(0);
    }
  });
});

// === 🔄 Auto-Init + Periodic Health Check ===
(async () => {
  try {
    await ensureConnection();
    setInterval(async () => {
      const healthy = await checkNeonConnection();
      if (!healthy) {
        console.log("🔁 DB unhealthy. Reconnecting...");
        isConnected = false;
        await ensureConnection();
      }
    }, HEALTH_CHECK_INTERVAL);
  } catch (err) {
    console.error("🚫 Failed during Prisma auto-init:", err);
    process.exit(1);
  }
})();

export default prisma;
