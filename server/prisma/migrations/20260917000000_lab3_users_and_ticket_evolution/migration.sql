-- CreateEnum
CREATE TYPE "Role" AS ENUM ('REQUESTER', 'IT_STAFF', 'ADMINISTRATOR');

-- AlterEnum
ALTER TYPE "Priority" ADD VALUE IF NOT EXISTS 'URGENT';

-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE IF NOT EXISTS 'OPEN';
ALTER TYPE "TicketStatus" ADD VALUE IF NOT EXISTS 'WAITING_FOR_REQUESTER';
ALTER TYPE "TicketStatus" ADD VALUE IF NOT EXISTS 'REOPENED';
ALTER TYPE "TicketStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'REQUESTER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_isActive_idx" ON "users"("role", "isActive");

-- Backfill existing Lab 2 requester_users into users to preserve ticket ownership IDs
INSERT INTO "users" ("id", "name", "email", "passwordHash", "role", "isActive", "mustChangePassword", "createdAt", "updatedAt")
SELECT 
    "id", 
    "name", 
    "email", 
    '$2a$10$0k4mQy0i2kC2Fq7Z3h7BteXU1Z0mH3iY7q2N8m6b1k5V9P4R7j3S2', -- default hash for initial login
    'REQUESTER'::"Role", 
    "isActive", 
    true, 
    "createdAt", 
    "updatedAt"
FROM "requester_users"
ON CONFLICT ("id") DO NOTHING;

-- Synchronize users sequence with max id
SELECT setval('users_id_seq', COALESCE((SELECT MAX("id") FROM "users"), 1));

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN "itPriority" "Priority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN "ownerId" INTEGER,
ADD COLUMN "resolutionSummary" TEXT,
ADD COLUMN "requesterResolvedIndication" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "tickets_ownerId_idx" ON "tickets"("ownerId");

-- CreateIndex
CREATE INDEX "tickets_ownerId_currentStatus_idx" ON "tickets"("ownerId", "currentStatus");

-- Drop old foreign key referencing requester_users and add new foreign key referencing users
ALTER TABLE "tickets" DROP CONSTRAINT IF EXISTS "tickets_requesterId_fkey";
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey for ticket owner
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "public_comments" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "public_comments_ticketId_idx" ON "public_comments"("ticketId");

-- AddForeignKey
ALTER TABLE "public_comments" ADD CONSTRAINT "public_comments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_comments" ADD CONSTRAINT "public_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "internal_notes" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "internal_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "internal_notes_ticketId_idx" ON "internal_notes"("ticketId");

-- AddForeignKey
ALTER TABLE "internal_notes" ADD CONSTRAINT "internal_notes_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internal_notes" ADD CONSTRAINT "internal_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
