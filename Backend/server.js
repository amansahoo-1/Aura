// backend/server.js

import app from "./app.js";
import prisma from "./client/prismaClient.js"; // Use the singleton instance

const PORT = parseInt(process.env.PORT || "3001", 10);
const NODE_ENV = process.env.NODE_ENV || "development";

const getDatabaseInfo = () => {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return "Not Configured";
  try {
    const [host, dbName] = dbUrl.split("@")[1].split("/");
    return `${host}/${dbName.split("?")[0]}`;
  } catch {
    return "Invalid DATABASE_URL format";
  }
};

const printStartupInfo = () => {
  console.log(`\n\n--- Aura Jewellery Rental Platform ---`);
  console.log(``);
  console.log(`
    🚀 Server running in ${NODE_ENV} mode
    📡 Listening on Port: ${PORT}
    🌐 Accepting requests from: ${process.env.CLIENT_URL || "Not Configured"}
    🗄️  Connected to Database: ${getDatabaseInfo()}
    🕒 Current Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
  `);
  console.log(`-------------------------------------\n`);
};

const server = app.listen(PORT, async () => {
  try {
    // Test the database connection on startup
    await prisma.$queryRaw`SELECT 1`;
    printStartupInfo();
  } catch (error) {
    console.error("❌ DATABASE CONNECTION FAILED:", error.message);
    console.error(
      "Please check your DATABASE_URL environment variable and ensure the database is running."
    );
    process.exit(1);
  }
});

// Graceful shutdown handler
const shutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
  try {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
    await prisma.$disconnect();
    console.log("💤 Server and database connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Shutdown error:", err);
    process.exit(1);
  }
};

// Listen for termination signals
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default server; // Export for testing purposes
