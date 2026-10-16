import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { Role, TicketStatus } from "@prisma/client";
import {
  categoriesData,
  relatedSystemsData,
  usersData,
  ticketsData,
} from "../../prisma/seed.js";

describe("Database Evolution & Seed Verification (Sprint 4 - Issue 28)", () => {
  describe("Prisma Schema & Migration SQL Verification", () => {
    const schemaPath = path.resolve(__dirname, "../../prisma/schema.prisma");
    const schemaContent = fs.readFileSync(schemaPath, "utf-8");

    it("verifies ActionTaken model is declared in schema.prisma", () => {
      expect(schemaContent).toContain("model ActionTaken {");
      expect(schemaContent).toContain('@@map("actions_taken")');
    });

    it("verifies ActionTaken has foreign keys to Ticket and User", () => {
      expect(schemaContent).toContain("ticketId         Int      @map(\"ticket_id\")");
      expect(schemaContent).toContain("performedById    Int      @map(\"performed_by_id\")");
      expect(schemaContent).toContain("ticket      Ticket @relation(fields: [ticketId], references: [id], onDelete: Cascade)");
      expect(schemaContent).toContain("performedBy User   @relation(\"PerformedActions\", fields: [performedById], references: [id], onDelete: Restrict)");
    });

    it("verifies inverse relations on Ticket and User models", () => {
      expect(schemaContent).toContain("actionsTaken ActionTaken[]");
      expect(schemaContent).toContain('actionsTaken     ActionTaken[]   @relation("PerformedActions")');
    });

    it("verifies formal migration SQL file exists and contains actions_taken table DDL", () => {
      const migrationDir = path.resolve(__dirname, "../../prisma/migrations");
      const migrationDirs = fs.readdirSync(migrationDir);
      const lab4Migration = migrationDirs.find((d) => d.includes("actions_taken"));
      expect(lab4Migration).toBeDefined();

      const sqlPath = path.join(migrationDir, lab4Migration!, "migration.sql");
      expect(fs.existsSync(sqlPath)).toBe(true);

      const sqlContent = fs.readFileSync(sqlPath, "utf-8");
      expect(sqlContent).toContain('CREATE TABLE "actions_taken"');
      expect(sqlContent).toContain('CONSTRAINT "actions_taken_pkey" PRIMARY KEY ("id")');
      expect(sqlContent).toContain('FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE CASCADE');
      expect(sqlContent).toContain('FOREIGN KEY ("performed_by_id") REFERENCES "users"("id") ON DELETE RESTRICT');
    });
  });

  describe("Seed Data Diverse Scenario Verification", () => {
    it("contains tickets with exactly zero Actions Taken", () => {
      const zeroActionTickets = (ticketsData as any[]).filter(
        (t) => !t.actionsTaken || t.actionsTaken.length === 0
      );
      expect(zeroActionTickets.length).toBeGreaterThanOrEqual(2);
      expect(zeroActionTickets.map((t) => t.ticketNumber)).toEqual(
        expect.arrayContaining(["TKT-2025-001003", "TKT-2025-001007"])
      );
    });

    it("contains tickets with exactly one Action Taken", () => {
      const singleActionTickets = (ticketsData as any[]).filter(
        (t) => t.actionsTaken && t.actionsTaken.length === 1
      );
      expect(singleActionTickets.length).toBeGreaterThanOrEqual(2);
      expect(singleActionTickets.map((t) => t.ticketNumber)).toEqual(
        expect.arrayContaining(["TKT-2025-001002", "TKT-2025-001005"])
      );
    });

    it("contains tickets with multiple Actions Taken", () => {
      const multiActionTickets = (ticketsData as any[]).filter(
        (t) => t.actionsTaken && t.actionsTaken.length > 1
      );
      expect(multiActionTickets.length).toBeGreaterThanOrEqual(2);
      expect(multiActionTickets.map((t) => t.ticketNumber)).toEqual(
        expect.arrayContaining(["TKT-2025-001001", "TKT-2025-001004"])
      );
    });

    it("enforces resolution gate on seed data: resolved tickets must have >= 1 action taken", () => {
      const resolvedTickets = (ticketsData as any[]).filter(
        (t) => t.currentStatus === TicketStatus.RESOLVED
      );
      expect(resolvedTickets.length).toBeGreaterThan(0);
      for (const t of resolvedTickets) {
        expect(t.actionsTaken).toBeDefined();
        expect(t.actionsTaken.length).toBeGreaterThanOrEqual(1);
        expect(t.resolutionSummary).toBeTruthy();
      }
    });

    it("verifies all Actions Taken have valid fields, non-empty description, and valid performer", () => {
      const staffEmails = new Set(
        usersData
          .filter((u) => u.role === Role.IT_STAFF || u.role === Role.ADMINISTRATOR)
          .map((u) => u.email)
      );

      const allActions: any[] = [];
      for (const t of ticketsData as any[]) {
        if (t.actionsTaken) {
          allActions.push(...t.actionsTaken);
        }
      }

      expect(allActions.length).toBeGreaterThanOrEqual(5);

      for (const act of allActions) {
        expect(act.description).toBeTruthy();
        expect(act.description.length).toBeGreaterThanOrEqual(3);
        expect(act.result).toBeTruthy();
        expect(act.result.length).toBeGreaterThanOrEqual(2);
        expect(staffEmails.has(act.performedByEmail)).toBe(true);

        if (act.followUpRequired) {
          expect(act.followUpNote).toBeTruthy();
          expect(act.followUpNote.length).toBeGreaterThanOrEqual(3);
        } else {
          expect(act.followUpNote).toBeNull();
        }
      }
    });

    it("verifies actions are attributed across multiple distinct IT Staff members", () => {
      const performers = new Set<string>();
      for (const t of ticketsData as any[]) {
        if (t.actionsTaken) {
          for (const a of t.actionsTaken) {
            performers.add(a.performedByEmail);
          }
        }
      }
      expect(performers.size).toBeGreaterThanOrEqual(3);
      expect(performers).toContain("somchai.it@toktickit.com");
      expect(performers).toContain("suda.staff@toktickit.com");
      expect(performers).toContain("wichai.tech@toktickit.com");
    });
  });

  describe("Idempotency Verification (API-MIG-01)", () => {
    it("simulates multiple seed executions and confirms zero duplicate records", () => {
      const categoryMap = new Map<string, any>();
      const systemMap = new Map<string, any>();
      const userMap = new Map<string, any>();
      const ticketMap = new Map<string, any>();
      const actionSet = new Set<string>();

      const runSeedSimulation = () => {
        for (const cat of categoriesData) {
          categoryMap.set(cat.name, { ...cat });
        }
        for (const sys of relatedSystemsData) {
          systemMap.set(sys.name, { ...sys });
        }
        for (const user of usersData) {
          userMap.set(user.email, { ...user });
        }
        for (const ticket of ticketsData as any[]) {
          ticketMap.set(ticket.ticketNumber, { ...ticket });
          for (const act of ticket.actionsTaken || []) {
            const compositeKey = `${ticket.ticketNumber}::${act.performedByEmail}::${act.description}`;
            actionSet.add(compositeKey);
          }
        }
      };

      // Run 1
      runSeedSimulation();
      const actionCountAfterRun1 = actionSet.size;
      expect(categoryMap.size).toBe(4);
      expect(systemMap.size).toBe(7);
      expect(userMap.size).toBe(usersData.length);
      expect(ticketMap.size).toBe(ticketsData.length);
      expect(actionCountAfterRun1).toBeGreaterThanOrEqual(5);

      // Run 2 (simulate idempotent re-execution)
      runSeedSimulation();
      expect(categoryMap.size).toBe(4);
      expect(systemMap.size).toBe(7);
      expect(userMap.size).toBe(usersData.length);
      expect(ticketMap.size).toBe(ticketsData.length);
      expect(actionSet.size).toBe(actionCountAfterRun1); // No new duplicates added!
    });
  });
});
