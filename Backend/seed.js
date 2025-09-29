// backend/seed.js
import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "./utils/hash.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const prisma = new PrismaClient();

async function main() {
  console.log("Starting the seed process...");

  const superAdminEmail = process.env.SUPERADMIN_EMAIL;
  const superAdminPassword = process.env.SUPERADMIN_PASSWORD;

  if (!superAdminEmail || !superAdminPassword) {
    throw new Error(
      "SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be set in your .env file."
    );
  }

  // Check if the SuperAdmin already exists
  const existingSuperAdmin = await prisma.admin.findUnique({
    where: { email: superAdminEmail },
  });

  if (existingSuperAdmin) {
    console.log("SuperAdmin already exists. No action needed.");
    return;
  }

  // Hash the password before storing it
  const hashedPassword = await hashPassword(superAdminPassword);

  // Create the SuperAdmin in the database
  await prisma.admin.create({
    data: {
      name: "Super Admin",
      email: superAdminEmail,
      password: hashedPassword,
      role: Role.SUPERADMIN,
    },
  });

  console.log("SuperAdmin account created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
