import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "Account and Access",
  "Hardware",
  "Software",
  "Network",
];

async function main() {
  console.log("Seeding IT request categories...");
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Successfully seeded IT request categories.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
