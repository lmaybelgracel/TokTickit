import { expect, test } from "@playwright/test";

test.describe("E2E-STAFF: IT Staff Multi-Role Ticket Collaboration & Resolution Flow", () => {
  const requesterUser = {
    id: 10,
    name: "Alice Requester",
    email: "alice.requester@example.com",
    role: "REQUESTER",
    isActive: true,
    mustChangePassword: false,
  };

  const staffUser = {
    id: 20,
    name: "Somchai Staff",
    email: "somchai.it@toktickit.com",
    role: "IT_STAFF",
    isActive: true,
    mustChangePassword: false,
  };

  const category = { id: 1, name: "Hardware", description: "Hardware support" };
  const system = { id: 1, name: "Corporate Laptop", category: "Hardware" };

  test("E2E-STAFF-01: requester submits ticket -> IT Staff claims, sets priority, adds note/comment, resolves ticket -> Requester verifies", async ({ page }) => {
    let currentTicket: any = {
      id: 101,
      ticketNumber: "TKT-2026-000101",
      summary: "Keyboard keys sticking",
      description: "Spacebar and enter keys are physically sticking.",
      requestedPriority: "MEDIUM",
      itPriority: "LOW",
      currentStatus: "NEW",
      requesterId: 10,
      ownerId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category,
      relatedSystem: system,
      requester: requesterUser,
      owner: null,
      attachments: [],
      requesterResolvedIndication: false,
      resolutionSummary: null,
      resolvedAt: null,
    };

    let publicComments: any[] = [];
    let internalNotes: any[] = [];
    let activeApiUser = staffUser;

    await page.route("**/api/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      const json = (body: unknown, status = 200) =>
        route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

      if (url.pathname === "/api/auth/login" && req.method() === "POST") {
        const body = JSON.parse(req.postData() || "{}");
        if (body.email === requesterUser.email) {
          activeApiUser = requesterUser;
          return json({ token: "token-requester", user: requesterUser });
        }
        activeApiUser = staffUser;
        return json({ token: "token-staff", user: staffUser });
      }

      if (url.pathname === "/api/auth/me") {
        return json(activeApiUser);
      }

      if (url.pathname === "/api/auth/logout") {
        return json({ message: "Logged out" });
      }

      if (url.pathname === "/api/categories") {
        return json([category]);
      }

      if (url.pathname === "/api/related-systems") {
        return json([system]);
      }

      if (url.pathname === "/api/staff/users") {
        return json([staffUser]);
      }

      if (url.pathname === "/api/staff/tickets" && req.method() === "GET") {
        return json({
          tickets: [currentTicket],
          pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
        });
      }

      if (url.pathname === "/api/staff/tickets/101" && req.method() === "GET") {
        return json({
          ...currentTicket,
          publicComments,
          internalNotes,
        });
      }

      if (url.pathname === "/api/tickets/101" && req.method() === "GET") {
        return json({
          ...currentTicket,
          publicComments,
        });
      }

      if (url.pathname === "/api/tickets" && req.method() === "GET") {
        return json({
          data: [currentTicket],
          pagination: { totalItems: 1, totalPages: 1, currentPage: 1, pageSize: 10 },
        });
      }

      if (url.pathname === "/api/staff/tickets/101/status" && req.method() === "PATCH") {
        const body = JSON.parse(req.postData() || "{}");
        currentTicket = {
          ...currentTicket,
          currentStatus: body.status,
        };
        return json(currentTicket);
      }

      if (url.pathname === "/api/staff/tickets/101/claim" && req.method() === "PATCH") {
        currentTicket = {
          ...currentTicket,
          ownerId: staffUser.id,
          owner: staffUser,
          currentStatus: "OPEN",
        };
        return json(currentTicket);
      }

      if (url.pathname === "/api/staff/tickets/101/priority" && req.method() === "PATCH") {
        const body = JSON.parse(req.postData() || "{}");
        currentTicket = {
          ...currentTicket,
          itPriority: body.itPriority,
        };
        return json(currentTicket);
      }

      if (url.pathname === "/api/tickets/101/notes" && req.method() === "POST") {
        const body = JSON.parse(req.postData() || "{}");
        const note = {
          id: 1,
          ticketId: 101,
          authorId: staffUser.id,
          author: staffUser,
          content: body.content,
          createdAt: new Date().toISOString(),
        };
        internalNotes.push(note);
        return json(note, 201);
      }

      if (url.pathname === "/api/tickets/101/comments" && req.method() === "GET") {
        return json(publicComments);
      }

      if (url.pathname === "/api/tickets/101/comments" && req.method() === "POST") {
        const body = JSON.parse(req.postData() || "{}");
        const comment = {
          id: 1,
          ticketId: 101,
          authorId: staffUser.id,
          author: staffUser,
          content: body.content,
          createdAt: new Date().toISOString(),
        };
        publicComments.push(comment);
        return json(comment, 201);
      }

      if (url.pathname === "/api/staff/tickets/101/resolve" && req.method() === "PATCH") {
        const body = JSON.parse(req.postData() || "{}");
        currentTicket = {
          ...currentTicket,
          currentStatus: "RESOLVED",
          resolutionSummary: body.resolutionSummary,
          resolvedAt: new Date().toISOString(),
        };
        return json(currentTicket);
      }

      return json({ error: "Not found" }, 404);
    });

    // 1. IT Staff logs in
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(staffUser.email);
    await page.locator("#login-password").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    // 2. Views Staff Queue with ticket
    await expect(page.getByRole("heading", { name: "IT Staff Ticket Queue" })).toBeVisible();
    const ticketRow = page.getByRole("row").filter({ hasText: "TKT-2026-000101" });
    await expect(ticketRow).toBeVisible();

    // Click on ticket to view Staff Detail
    await page.getByRole("button", { name: "TKT-2026-000101" }).click();
    await expect(page.getByRole("heading", { name: "TKT-2026-000101" })).toBeVisible();
    await expect(page.getByText("Keyboard keys sticking")).toBeVisible();

    // 3. Claim Ticket
    const claimBtn = page.getByRole("button", { name: /Claim Ticket/i });
    await expect(claimBtn).toBeVisible();
    await claimBtn.click();
    await expect(page.locator(".staff-detail__meta-value").filter({ hasText: "Somchai Staff" })).toBeVisible();

    // 4. Update IT Priority to HIGH
    const prioritySelect = page.getByLabel(/IT Priority/i);
    await prioritySelect.selectOption("HIGH");

    // 5. Post confidential internal note
    const notesTab = page.getByRole("tab", { name: /Internal Notes/i });
    await notesTab.click();
    await expect(page.getByText(/Visible only to IT Staff/i)).toBeVisible();

    await page.getByPlaceholder(/Write a private internal note for IT Staff/i).fill("Hardware replacement keyboard scheduled.");
    await page.getByRole("button", { name: /Add Internal Note/i }).click();
    await expect(page.getByText("Hardware replacement keyboard scheduled.")).toBeVisible();

    // 6. Post public comment
    const commentsTab = page.getByRole("tab", { name: /Public Comments/i });
    await commentsTab.click();
    await page.getByPlaceholder(/Write a public comment for the requester/i).fill("We have cleaned and verified the keyboard mechanism.");
    await page.getByRole("button", { name: /Post Public Comment/i }).click();
    await expect(page.getByText("We have cleaned and verified the keyboard mechanism.")).toBeVisible();

    // 7. Transition status to IN PROGRESS so ticket can be resolved
    const nextStatusSelect = page.getByLabel(/Next Status/i);
    await nextStatusSelect.selectOption("IN_PROGRESS");

    // 8. Resolve ticket
    await page.getByRole("button", { name: /Resolve Ticket/i }).click();
    await expect(page.getByRole("heading", { name: /Resolve Ticket/i })).toBeVisible();

    const resolveInput = page.getByPlaceholder(/Describe how the problem was resolved/i);
    await resolveInput.fill("Cleaned keyboard contacts and verified all keys operate smoothly.");
    await page.getByRole("button", { name: /Confirm & Resolve/i }).click();

    // Status updated to RESOLVED
    await expect(page.locator(".staff-detail__title-wrap").getByText("RESOLVED")).toBeVisible();

    // 8. Sign out IT Staff
    await page.getByRole("button", { name: /Sign Out/i }).click();

    // 9. Requester logs in
    await page.getByLabel(/Email Address/i).fill(requesterUser.email);
    await page.locator("#login-password").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    // 10. Requester views resolved ticket
    const reqTicketRow = page.getByRole("row").filter({ hasText: "TKT-2026-000101" });
    await expect(reqTicketRow).toBeVisible();
    await reqTicketRow.getByRole("button", { name: /View detail/i }).click();

    // Verify resolution summary and public comments are visible
    await expect(page.getByText("Cleaned keyboard contacts and verified all keys operate smoothly.")).toBeVisible();
    await expect(page.getByText("We have cleaned and verified the keyboard mechanism.")).toBeVisible();

    // Verify confidential internal note is NOT visible to Requester
    await expect(page.getByText("Hardware replacement keyboard scheduled.")).not.toBeVisible();
  });
});
