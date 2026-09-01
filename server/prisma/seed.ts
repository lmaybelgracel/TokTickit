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
    name: "Jennifer Anderson",
    email: "jennifer.a@kmutt.ac.th",
    department: "Faculty of Engineering",
    isActive: true,
  },
  {
    name: "Michael Brown",
    email: "michael.b@kmutt.ac.th",
    department: "School of Information Technology",
    isActive: true,
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@kmutt.ac.th",
    department: "Faculty of Science",
    isActive: true,
  },
  {
    name: "David Lee",
    email: "david.l@kmutt.ac.th",
    department: "School of Architecture",
    isActive: true,
  },
  {
    name: "John Doe",
    email: "john.d@kmutt.ac.th",
    department: "Discontinued Staff",
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
    await prisma.requesterUser.upsert({
      where: { email: req.email },
      update: { name: req.name, department: req.department, isActive: req.isActive },
      create: req,
    });
  }
  console.log("Successfully seeded 4 Active Requesters and 1 Inactive Requester.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
