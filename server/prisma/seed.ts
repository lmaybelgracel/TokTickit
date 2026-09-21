import { PrismaClient, Role, Priority, TicketStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const categoriesData = [
  { name: "Account and Access", description: "Login, passwords, permission requests" },
  { name: "Hardware", description: "Laptops, monitors, printers, peripherals" },
  { name: "Software", description: "OS, office apps, specialized tools" },
  { name: "Network", description: "Wi-Fi, VPN, campus network connectivity" },
];

export const relatedSystemsData = [
  { name: "Email", category: "Account and Access" },
  { name: "Campus Wi-Fi", category: "Network" },
  { name: "VPN", category: "Network" },
  { name: "LEB2 App", category: "Software" },
  { name: "Grade Submission App", category: "Software" },
  { name: "Printer", category: "Hardware" },
  { name: "Corporate Laptop", category: "Hardware" },
];

const DEFAULT_PASSWORD = "Password123!";
const DEFAULT_SALT_ROUNDS = 10;
const defaultHash = bcrypt.hashSync(DEFAULT_PASSWORD, DEFAULT_SALT_ROUNDS);

const TEMP_PASSWORD = "Pass1234!";
const tempHash = bcrypt.hashSync(TEMP_PASSWORD, DEFAULT_SALT_ROUNDS);

export const usersData = [
  // Requesters (Active & Inactive) - Department excluded per Lab 3 specification (Section 4.2 & 5.1)
  {
    name: "Pae Karn",
    email: "pae.karn@example.com",
    role: Role.REQUESTER,
    isActive: true,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },
  {
    name: "Miki Chan",
    email: "miki.chan@example.com",
    role: Role.REQUESTER,
    isActive: true,
    mustChangePassword: true,
    passwordHash: tempHash,
  },
  {
    name: "Creammie Indiegurl",
    email: "creammie.indiegurl@example.com",
    role: Role.REQUESTER,
    isActive: true,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },
  {
    name: "Jessica Phrao",
    email: "jessica.phrao@example.com",
    role: Role.REQUESTER,
    isActive: true,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },
  {
    name: "Kanta Tawaan",
    email: "kanta.tawaan@example.com",
    role: Role.REQUESTER,
    isActive: true,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },
  {
    name: "Bewnoi Pink",
    email: "bewnoi.pink@example.com",
    role: Role.REQUESTER,
    isActive: true,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },
  {
    name: "Jeje Frappe",
    email: "jeje.frappe@example.com",
    role: Role.REQUESTER,
    isActive: true,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },
  {
    name: "Bob Pueng",
    email: "bob.pueng@example.com",
    role: Role.REQUESTER,
    isActive: true,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },
  {
    name: "Pan Ctrl",
    email: "pan.ctrl@example.com",
    role: Role.REQUESTER,
    isActive: false,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },

  // IT Staff (Active & Inactive)
  {
    name: "Somchai Prasert",
    email: "somchai.it@toktickit.com",
    role: Role.IT_STAFF,
    isActive: true,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },
  {
    name: "Suda Jaidee",
    email: "suda.staff@toktickit.com",
    role: Role.IT_STAFF,
    isActive: true,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },
  {
    name: "Wichai Somboon",
    email: "wichai.tech@toktickit.com",
    role: Role.IT_STAFF,
    isActive: true,
    mustChangePassword: true,
    passwordHash: tempHash,
  },
  {
    name: "Nat Deactivated",
    email: "nat.retired@toktickit.com",
    role: Role.IT_STAFF,
    isActive: false,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },

  // Administrators
  {
    name: "Root Administrator",
    email: "admin@toktickit.com",
    role: Role.ADMINISTRATOR,
    isActive: true,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },
  {
    name: "Backup Administrator",
    email: "backup.admin@toktickit.com",
    role: Role.ADMINISTRATOR,
    isActive: true,
    mustChangePassword: false,
    passwordHash: defaultHash,
  },
];

export const ticketsData = [
  {
    ticketNumber: "TKT-2025-001001",
    summary: "Cannot access university email after password reset",
    description: "I reset my email password yesterday via self-service, but now neither webmail nor Outlook accepts the new password.",
    requestedPriority: Priority.HIGH,
    itPriority: Priority.HIGH,
    currentStatus: TicketStatus.OPEN,
    requesterEmail: "pae.karn@example.com",
    ownerEmail: "somchai.it@toktickit.com",
    categoryName: "Account and Access",
    relatedSystemName: "Email",
    resolutionSummary: null,
    requesterResolvedIndication: false,
    comments: [
      {
        authorEmail: "somchai.it@toktickit.com",
        content: "Checking the LDAP synchronization logs for your email mailbox now.",
      },
    ],
    notes: [
      {
        authorEmail: "somchai.it@toktickit.com",
        content: "Active Directory replication queue was paused. Restarting AD sync service.",
      },
    ],
  },
  {
    ticketNumber: "TKT-2025-001002",
    summary: "Flickering display on Lenovo ThinkPad screen",
    description: "The internal laptop display intermittently flickers horizontal lines when moving the hinge.",
    requestedPriority: Priority.MEDIUM,
    itPriority: Priority.MEDIUM,
    currentStatus: TicketStatus.IN_PROGRESS,
    requesterEmail: "creammie.indiegurl@example.com",
    ownerEmail: "suda.staff@toktickit.com",
    categoryName: "Hardware",
    relatedSystemName: "Corporate Laptop",
    resolutionSummary: null,
    requesterResolvedIndication: false,
    comments: [
      {
        authorEmail: "suda.staff@toktickit.com",
        content: "Could you bring the laptop by the IT service desk on 3rd floor today so we can inspect the EDP display ribbon cable?",
      },
      {
        authorEmail: "creammie.indiegurl@example.com",
        content: "Sure, I will drop by around 2:00 PM.",
      },
    ],
    notes: [],
  },
  {
    ticketNumber: "TKT-2025-001003",
    summary: "Wi-Fi drops connection repeatedly in Building 12 lecture hall",
    description: "Every 10-15 minutes, the connection to KMUTT-Secure drops and requires toggling Wi-Fi off and on.",
    requestedPriority: Priority.LOW,
    itPriority: Priority.LOW,
    currentStatus: TicketStatus.NEW,
    requesterEmail: "jessica.phrao@example.com",
    ownerEmail: null,
    categoryName: "Network",
    relatedSystemName: "Campus Wi-Fi",
    resolutionSummary: null,
    requesterResolvedIndication: false,
    comments: [],
    notes: [],
  },
  {
    ticketNumber: "TKT-2025-001004",
    summary: "Error 500 when uploading assignment submission PDF",
    description: "Trying to upload my final assignment (3.2 MB PDF) results in a continuous loading spinner and then Error 500.",
    requestedPriority: Priority.URGENT,
    itPriority: Priority.URGENT,
    currentStatus: TicketStatus.RESOLVED,
    requesterEmail: "pae.karn@example.com",
    ownerEmail: "somchai.it@toktickit.com",
    categoryName: "Software",
    relatedSystemName: "LEB2 App",
    resolutionSummary: "Increased Nginx client_max_body_size on LEB2 upload ingress gateway from 2MB to 20MB and reloaded service.",
    requesterResolvedIndication: true,
    comments: [
      {
        authorEmail: "somchai.it@toktickit.com",
        content: "Issue has been resolved. Ingress upload limit increased.",
      },
    ],
    notes: [
      {
        authorEmail: "somchai.it@toktickit.com",
        content: "Tested upload with 15MB PDF sample; response returned 200 OK.",
      },
    ],
  },
  {
    ticketNumber: "TKT-2025-001005",
    summary: "Need grade submission role assignment for TA course",
    description: "Appointed as TA for CSC210 this semester, need grade input authorization in the grade submission portal.",
    requestedPriority: Priority.MEDIUM,
    itPriority: Priority.MEDIUM,
    currentStatus: TicketStatus.WAITING_FOR_REQUESTER,
    requesterEmail: "miki.chan@example.com",
    ownerEmail: "suda.staff@toktickit.com",
    categoryName: "Software",
    relatedSystemName: "Grade Submission App",
    resolutionSummary: null,
    requesterResolvedIndication: false,
    comments: [
      {
        authorEmail: "suda.staff@toktickit.com",
        content: "Please provide the course coordinator instructor sign-off memo or instructor email confirmation.",
      },
    ],
    notes: [],
  },
  {
    ticketNumber: "TKT-2025-001006",
    summary: "Paper jam in Engineering Lab 4th floor printer",
    description: "Red light blinking with error code E-04 paper jam in tray 2.",
    requestedPriority: Priority.LOW,
    itPriority: Priority.LOW,
    currentStatus: TicketStatus.CLOSED,
    requesterEmail: "creammie.indiegurl@example.com",
    ownerEmail: "wichai.tech@toktickit.com",
    categoryName: "Hardware",
    relatedSystemName: "Printer",
    resolutionSummary: "Cleared jammed paper feed roller and replaced pickup roller assembly.",
    requesterResolvedIndication: false,
    comments: [],
    notes: [
      {
        authorEmail: "wichai.tech@toktickit.com",
        content: "Replaced roller part #RM1-4426-000 from local spare parts inventory.",
      },
    ],
  },
  {
    ticketNumber: "TKT-2025-001007",
    summary: "VPN certificate expired warning",
    description: "When connecting to OpenVPN client, dialog says certificate expired on September 15.",
    requestedPriority: Priority.HIGH,
    itPriority: Priority.HIGH,
    currentStatus: TicketStatus.CANCELLED,
    requesterEmail: "pae.karn@example.com",
    ownerEmail: null,
    categoryName: "Network",
    relatedSystemName: "VPN",
    resolutionSummary: null,
    requesterResolvedIndication: false,
    comments: [],
    notes: [],
  },
];

export async function seedDatabase(client = prisma) {
  console.log("Seeding TokTickIT Database (Idempotent)...");

  // 1. Categories
  for (const cat of categoriesData) {
    await client.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: { name: cat.name, description: cat.description },
    });
  }
  console.log(`Successfully seeded ${categoriesData.length} Categories.`);

  // 2. Related Systems
  for (const sys of relatedSystemsData) {
    await client.relatedSystem.upsert({
      where: { name: sys.name },
      update: { category: sys.category },
      create: { name: sys.name, category: sys.category },
    });
  }
  console.log(`Successfully seeded ${relatedSystemsData.length} Related Systems.`);

  // 3. User Migration / Backfill from Lab 2 requester_users
  // Ensures existing Lab 2 requester IDs map identically to User IDs with zero data loss
  try {
    const existingRequesters = await client.requesterUser.findMany();
    for (const req of existingRequesters) {
      await client.user.upsert({
        where: { email: req.email },
        update: {
          name: req.name,
          isActive: req.isActive,
        },
        create: {
          id: req.id,
          name: req.name,
          email: req.email,
          role: Role.REQUESTER,
          isActive: req.isActive,
          mustChangePassword: true,
          passwordHash: tempHash,
        },
      });
    }
  } catch (e) {
    // If table doesn't exist yet, continue
  }

  // 4. Users (Requesters, IT Staff, Administrators)
  const userMap = new Map<string, any>();
  for (const user of usersData) {
    const record = await client.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        mustChangePassword: user.mustChangePassword,
        passwordHash: user.passwordHash,
      },
      create: user,
    });
    userMap.set(user.email, record);

    // Also sync RequesterUser for Lab 2 backward compatibility
    if (user.role === Role.REQUESTER) {
      await client.requesterUser.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          department: "General",
          isActive: user.isActive,
        },
        create: {
          name: user.name,
          email: user.email,
          department: "General",
          isActive: user.isActive,
        },
      });
    }
  }
  console.log(`Successfully seeded ${usersData.length} Users.`);

  // Lookup maps for foreign keys
  const categoryRecords = await client.category.findMany();
  const catMap = new Map(categoryRecords.map((c) => [c.name, c.id]));

  const systemRecords = await client.relatedSystem.findMany();
  const sysMap = new Map(systemRecords.map((s) => [s.name, s.id]));

  // 5. Tickets
  for (const tkt of ticketsData) {
    const requester = userMap.get(tkt.requesterEmail);
    const owner = tkt.ownerEmail ? userMap.get(tkt.ownerEmail) : null;
    const categoryId = catMap.get(tkt.categoryName);
    const relatedSystemId = sysMap.get(tkt.relatedSystemName);

    if (!requester || !categoryId || !relatedSystemId) {
      console.warn(`Skipping ticket ${tkt.ticketNumber} due to missing relation.`);
      continue;
    }

    const ticketRecord = await client.ticket.upsert({
      where: { ticketNumber: tkt.ticketNumber },
      update: {
        summary: tkt.summary,
        description: tkt.description,
        requestedPriority: tkt.requestedPriority,
        itPriority: tkt.itPriority,
        currentStatus: tkt.currentStatus,
        requesterId: requester.id,
        ownerId: owner ? owner.id : null,
        categoryId,
        relatedSystemId,
        resolutionSummary: tkt.resolutionSummary,
        requesterResolvedIndication: tkt.requesterResolvedIndication,
      },
      create: {
        ticketNumber: tkt.ticketNumber,
        summary: tkt.summary,
        description: tkt.description,
        requestedPriority: tkt.requestedPriority,
        itPriority: tkt.itPriority,
        currentStatus: tkt.currentStatus,
        requesterId: requester.id,
        ownerId: owner ? owner.id : null,
        categoryId,
        relatedSystemId,
        resolutionSummary: tkt.resolutionSummary,
        requesterResolvedIndication: tkt.requesterResolvedIndication,
      },
    });

    // 6. Comments
    for (const c of tkt.comments) {
      const author = userMap.get(c.authorEmail);
      if (author) {
        const existing = await client.publicComment.findFirst({
          where: { ticketId: ticketRecord.id, authorId: author.id, content: c.content },
        });
        if (!existing) {
          await client.publicComment.create({
            data: {
              ticketId: ticketRecord.id,
              authorId: author.id,
              content: c.content,
            },
          });
        }
      }
    }

    // 7. Internal Notes
    for (const n of tkt.notes) {
      const author = userMap.get(n.authorEmail);
      if (author) {
        const existing = await client.internalNote.findFirst({
          where: { ticketId: ticketRecord.id, authorId: author.id, content: n.content },
        });
        if (!existing) {
          await client.internalNote.create({
            data: {
              ticketId: ticketRecord.id,
              authorId: author.id,
              content: n.content,
            },
          });
        }
      }
    }
  }
  console.log(`Successfully seeded ${ticketsData.length} Tickets with Comments and Notes.`);
}

async function main() {
  await seedDatabase(prisma);
}

if (process.argv[1] && process.argv[1].includes("seed.ts")) {
  main()
    .catch((e) => {
      console.error("Error during seeding:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
