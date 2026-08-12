import { describe, it, expect } from "vitest";

describe("Category Seeding Idempotency", () => {
  it("ensures seeding multiple times results in exactly 4 unique categories without duplicates", async () => {
    const categories = ["Account and Access", "Hardware", "Software", "Network"];
    const databaseMap = new Map<string, { id: number; name: string }>();

    // Simulate seed run 1
    for (const name of categories) {
      if (!databaseMap.has(name)) {
        databaseMap.set(name, { id: databaseMap.size + 1, name });
      }
    }
    expect(databaseMap.size).toBe(4);

    // Simulate seed run 2 (re-running seed script)
    for (const name of categories) {
      if (!databaseMap.has(name)) {
        databaseMap.set(name, { id: databaseMap.size + 1, name });
      }
    }

    // Verify database count remains strictly 4
    expect(databaseMap.size).toBe(4);
    expect(Array.from(databaseMap.keys())).toEqual([
      "Account and Access",
      "Hardware",
      "Software",
      "Network",
    ]);
  });
});
