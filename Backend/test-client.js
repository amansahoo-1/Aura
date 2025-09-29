// backend/test-client.js

import prisma from "./client/prismaClient.js";

async function checkClient() {
  console.log("--- Checking the properties of the imported Prisma Client ---");

  // This will print an array of all the models Prisma knows about,
  // e.g., ['user', 'admin', 'seller', 'product', ...]
  console.log(Object.keys(prisma));

  // Let's also check if prisma.seller is specifically undefined
  if (prisma.seller === undefined) {
    console.error("\nCRITICAL: prisma.seller is undefined.");
  } else {
    console.log("\nSUCCESS: prisma.seller is defined.");
  }

  await prisma.$disconnect();
}

checkClient().catch(console.error);
