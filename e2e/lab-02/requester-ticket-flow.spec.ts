import { expect, test } from "@playwright/test";

test("E2E-01: requester creates, finds, opens, and manages a ticket with isolated ownership", async ({ page }) => {
  const requesters = [
    { id: 1, name: "Pae Karn", email: "pae.karn@example.com", department: "Engineering", isActive: true },
    { id: 2, name: "Miki Chan", email: "miki.chan@example.com", department: "Information Technology", isActive: true },
  ];
  const category = { id: 1, name: "Hardware", description: "Devices" };
  const system = { id: 1, name: "Corporate Laptop", category: "Hardware" };
  let tickets: any[] = [];
  let attachments: any[] = [];

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const requesterId = Number(request.headers()["x-development-requester-id"] || 0);
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

    if (url.pathname === "/api/requesters") return json(requesters);
    if (url.pathname === "/api/categories") return json([category]);
    if (url.pathname === "/api/related-systems") return json([system]);
    if (url.pathname === "/api/tickets" && request.method() === "POST") {
      const payload = { categoryId: 1, relatedSystemId: 1, requestedPriority: "MEDIUM", summary: "Laptop battery drains quickly", description: "Battery drains within one hour during normal use." };
      const ticket = { id: 101, ticketNumber: "TKT-2026-000101", ...payload, requesterId, currentStatus: "NEW", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), category, relatedSystem: system };
      tickets.push(ticket); return json(ticket, 201);
    }
    if (url.pathname === "/api/tickets" && request.method() === "GET") {
      const owned = tickets.filter((ticket) => ticket.requesterId === requesterId);
      return json({ data: owned, pagination: { totalItems: owned.length, totalPages: 1, currentPage: 1, pageSize: 10 } });
    }
    if (url.pathname === "/api/tickets/101" && request.method() === "GET") {
      const ticket = tickets[0];
      if (!ticket || ticket.requesterId !== requesterId) return json({ error: { code: "FORBIDDEN_ACCESS", message: "Forbidden" } }, 403);
      return json({ ...ticket, requester: requesters[0], attachments });
    }
    if (url.pathname === "/api/tickets/101/attachments" && request.method() === "POST") {
      const attachment = { id: 501, ticketId: 101, filename: "evidence.png", fileSize: 8, mimeType: "image/png", isRemoved: false, uploadedAt: new Date().toISOString() };
      attachments = [attachment]; return json(attachment, 201);
    }
    if (url.pathname === "/api/attachments/501" && request.method() === "DELETE") {
      attachments = [{ ...attachments[0], isRemoved: true, removedAt: new Date().toISOString(), removalReason: "Outdated screenshot" }];
      return json(attachments[0]);
    }
    return json({ error: { code: "NOT_FOUND" } }, 404);
  });

  await page.goto("/");
  await page.getByRole("combobox").selectOption("1");
  await page.getByRole("button", { name: "Continue to Application", exact: true }).click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "+ Create Ticket", exact: true })
    .click();
  await page.getByLabel("Summary").fill("Laptop battery drains quickly");
  await page.getByLabel("Description").fill("Battery drains within one hour during normal use.");
  await page.getByLabel("Initial attachments").setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("invalid") });
  await page.getByRole("button", { name: "Submit Ticket" }).click();
  await expect(page.getByText("Only JPG, PNG, WEBP, and PDF files are allowed.")).toBeVisible();
  await page.getByLabel("Initial attachments").setInputFiles({ name: "initial-proof.png", mimeType: "image/png", buffer: Buffer.from("proof") });
  await page.getByRole("button", { name: "Submit Ticket" }).click();

  const createdTicketRow = page.getByRole("row").filter({ hasText: "TKT-2026-000101" });
  await expect(createdTicketRow).toBeVisible();
  await createdTicketRow.getByRole("button", { name: "View detail" }).click();
  await expect(page.getByRole("heading", { name: "TKT-2026-000101" })).toBeVisible();

  await page.getByLabel("Upload attachment").setInputFiles({ name: "evidence.png", mimeType: "image/png", buffer: Buffer.from("evidence") });
  await expect(page.getByText("evidence.png")).toBeVisible();
  await page.getByRole("button", { name: "Soft Remove" }).click();
  await page.getByRole("textbox").fill("Outdated screenshot");
  await page.getByRole("button", { name: "Confirm removal" }).click();
  await expect(page.getByText("Removed", { exact: true })).toBeVisible();
  await expect(page.getByTitle("File removed - download unavailable")).toBeDisabled();

  await page.getByRole("button", { name: "Change" }).click();
  await page.getByRole("combobox").selectOption("2");
  await page.getByRole("button", { name: "Continue to Application", exact: true }).click();
  await expect(page.getByRole("heading", { name: "No Tickets Yet" })).toBeVisible();
  await expect(page.getByText("You haven't submitted any IT support tickets.", { exact: false })).toBeVisible();
});
