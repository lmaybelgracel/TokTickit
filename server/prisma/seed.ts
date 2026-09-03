import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categoriesData = [
  { name: "Account and Access", description: "Login, passwords, permission requests" },
  { name: "Hardware", description: "Laptops, monitors, printers, peripherals" },
  { name: "Software", description: "OS, office apps, specialized tools" },
  { name: "Network", description: "Wi-Fi, VPN, campus network connectivity" },
];

const relatedSystemsData = [
  { name: "Email", category: "Account and Access" },
  { name: "Campus Wi-Fi", category: "Network" },
  { name: "VPN", category: "Network" },
  { name: "LEB2 App", category: "Software" },
  { name: "Grade Submission App", category: "Software" },
  { name: "Printer", category: "Hardware" },
  { name: "Corporate Laptop", category: "Hardware" },
];

const requestersData = [
  {
    name: "Pae Karn",
    email: "pae.karn@example.com",
    department: "Engineering",
    isActive: true,
    legacyEmail: "jennifer.a@kmutt.ac.th",
  },
  {
    name: "Miki Chan",
    email: "miki.chan@example.com",
    department: "Information Technology",
    isActive: true,
    legacyEmail: "michael.b@kmutt.ac.th",
  },
  {
    name: "Creammie Indiegurl",
    email: "creammie.indiegurl@example.com",
    department: "Digital Media",
    isActive: true,
    legacyEmail: "sarah.j@kmutt.ac.th",
  },
  {
    name: "Jessica Phrao",
    email: "jessica.phrao@example.com",
    department: "Business Administration",
    isActive: true,
    legacyEmail: "david.l@kmutt.ac.th",
  },
  {
    name: "Kanta Tawaan",
    email: "kanta.tawaan@example.com",
    department: "Computer Engineering",
    isActive: true,
    legacyEmail: "john.d@kmutt.ac.th",
  },
  { name: "Bewnoi Pink", email: "bewnoi.pink@example.com", department: "Information Technology", isActive: true },
  { name: "Jeje Frappe", email: "jeje.frappe@example.com", department: "Creative Technology", isActive: true },
  { name: "Bob Pueng", email: "bob.pueng@example.com", department: "Engineering", isActive: true },
  {
    name: "Pan Ctrl",
    email: "pan.ctrl@example.com",
    department: "Former Student",
    isActive: false,
  },
];

async function main() {
  console.log("Seeding Lab 2 Reference Data & Development Requesters...");

  // 1. Seed Categories
  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: { name: cat.name, description: cat.description },
    });
  }
  console.log("Successfully seeded 4 IT Categories.");

  // 2. Seed Related Systems
  for (const sys of relatedSystemsData) {
    await prisma.relatedSystem.upsert({
      where: { name: sys.name },
      update: { category: sys.category },
      create: { name: sys.name, category: sys.category },
    });
  }
  console.log("Successfully seeded 7 Related Systems.");

  // 3. Seed Development Requesters
  for (const req of requestersData) {
    const { legacyEmail, ...requester } = req;
    if (legacyEmail) {
      const currentRecord = await prisma.requesterUser.findUnique({ where: { email: requester.email } });
      if (currentRecord) {
        await prisma.requesterUser.updateMany({ where: { email: legacyEmail }, data: { isActive: false } });
      } else {
        await prisma.requesterUser.updateMany({ where: { email: legacyEmail }, data: requester });
      }
    }
    await prisma.requesterUser.upsert({
      where: { email: requester.email },
      update: { name: requester.name, department: requester.department, isActive: requester.isActive },
      create: requester,
    });
  }
  console.log("Successfully seeded 8 Active Requesters and 1 Inactive Requester.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
