import { test, expect, Page } from "@playwright/test";

test.describe("Sprint 3 Visual Evidence & Responsive Style Audit (Issue 24)", () => {
  const assertNoHorizontalOverflow = async (page: Page) => {
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(isOverflowing).toBe(false);
  };

  const adminUser = {
    id: 1,
    name: "Suda Administrator",
    email: "admin@toktickit.com",
    role: "ADMINISTRATOR",
    isActive: true,
    mustChangePassword: false,
  };

  const staffUser = {
    id: 2,
    name: "Somchai Staff",
    email: "somchai.it@toktickit.com",
    role: "IT_STAFF",
    isActive: true,
    mustChangePassword: false,
  };

  const mustChangeUser = {
    id: 3,
    name: "New Recruit",
    email: "recruit@toktickit.com",
    role: "IT_STAFF",
    isActive: true,
    mustChangePassword: true,
  };

  const requesterUser = {
    id: 10,
    name: "Pae Requester",
    email: "pae.karn@example.com",
    role: "REQUESTER",
    isActive: true,
    mustChangePassword: false,
  };

  const category = { id: 1, name: "Hardware", description: "Computer and peripheral equipment" };
  const system = { id: 1, name: "Staff Laptop", categoryId: 1 };

  const sampleTicket = {
    id: 101,
    ticketNumber: "TKT-2026-000101",
    summary: "External Display flickering and disconnecting intermittently",
    description: "During extended usage, the secondary 4K display blackouts every 15 minutes.",
    requestedPriority: "HIGH",
    itPriority: "HIGH",
    currentStatus: "IN_PROGRESS",
    requesterId: 10,
    ownerId: 2,
    createdAt: "2026-09-15T08:30:00Z",
    updatedAt: "2026-09-15T09:15:00Z",
    category,
    relatedSystem: system,
    requester: requesterUser,
    owner: staffUser,
    attachments: [
      {
        id: 501,
        filename: "cable_diagnostics_log.txt",
        fileSize: 1024,
        mimeType: "text/plain",
      },
    ],
    requesterResolvedIndication: false,
    resolutionSummary: null,
    resolvedAt: null,
  };

  const sampleTicketsList = [
    sampleTicket,
    {
      id: 102,
      ticketNumber: "TKT-2026-000102",
      summary: "VPN Client tunnel drops during file transfers",
      description: "When downloading large assets, connection resets.",
      requestedPriority: "MEDIUM",
      itPriority: "MEDIUM",
      currentStatus: "OPEN",
      requesterId: 11,
      ownerId: null,
      createdAt: "2026-09-15T10:00:00Z",
      updatedAt: "2026-09-15T10:00:00Z",
      category: { id: 2, name: "Network" },
      relatedSystem: { id: 2, name: "VPN Gateway" },
      requester: { id: 11, name: "Kanda Finance", email: "kanda@example.com", role: "REQUESTER" },
      owner: null,
      attachments: [],
    },
    {
      id: 103,
      ticketNumber: "TKT-2026-000103",
      summary: "Database query timeout on report generation",
      description: "Generating Q3 summary causes timeout.",
      requestedPriority: "LOW",
      itPriority: "LOW",
      currentStatus: "RESOLVED",
      requesterId: 12,
      ownerId: 2,
      createdAt: "2026-09-14T14:00:00Z",
      updatedAt: "2026-09-15T07:30:00Z",
      category: { id: 3, name: "Software" },
      relatedSystem: { id: 3, name: "Reporting DB" },
      requester: { id: 12, name: "Vichai Analyst", email: "vichai@example.com", role: "REQUESTER" },
      owner: staffUser,
      attachments: [],
      resolutionSummary: "Added index on transaction_date column to resolve query bottleneck.",
    },
  ];

  const sampleUsers = [
    adminUser,
    staffUser,
    mustChangeUser,
    requesterUser,
    {
      id: 20,
      name: "Inactive Contractor",
      email: "contractor@example.com",
      role: "REQUESTER",
      isActive: false,
      mustChangePassword: false,
    },
  ];

  const publicComments = [
    {
      id: 1,
      ticketId: 101,
      authorId: 10,
      content: "I replaced the HDMI cable, but the display still blinks occasionally.",
      createdAt: "2026-09-15T08:45:00Z",
      author: requesterUser,
    },
    {
      id: 2,
      ticketId: 101,
      authorId: 2,
      content: "Thank you for checking. We will test with a certified Thunderbolt dock.",
      createdAt: "2026-09-15T09:15:00Z",
      author: staffUser,
    },
  ];

  const internalNotes = [
    {
      id: 1,
      ticketId: 101,
      authorId: 2,
      content: "Confirmed dock firmware is v1.2. Updating to v1.4 via diagnostics utility.",
      createdAt: "2026-09-15T09:00:00Z",
      author: staffUser,
    },
  ];

  test("1. Captures responsive visual evidence for Authentication suite", async ({ page }) => {
    await page.route("**/api/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      const json = (body: unknown, status = 200) =>
        route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

      if (url.pathname === "/api/auth/login" && req.method() === "POST") {
        const body = JSON.parse(req.postData() || "{}");
        if (body.email === "wrong@toktickit.com") {
          return json({ error: "Invalid email or password." }, 401);
        }
        if (body.email === mustChangeUser.email) {
          return json({ token: "token-mustchange", user: mustChangeUser });
        }
        return json({ token: "token-staff", user: staffUser });
      }

      if (url.pathname === "/api/auth/me") {
        return json(mustChangeUser);
      }

      if (url.pathname === "/api/auth/change-password" && req.method() === "POST") {
        return json({ message: "Password updated successfully" });
      }

      return json({}, 200);
    });

    // 1.1 Desktop (1280px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "TokTickIT" })).toBeVisible();
    await expect(page.getByText("Sign in to your account")).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/authentication/login-desktop.png", fullPage: true });

    // 1.2 Tablet (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/authentication/login-tablet.png", fullPage: true });

    // 1.3 Mobile (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/authentication/login-mobile.png", fullPage: true });

    // 1.4 Small Mobile (320px)
    await page.setViewportSize({ width: 320, height: 568 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/authentication/login-small-mobile.png", fullPage: true });

    // 1.5 Validation Error State
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.getByLabel(/Email Address/i).fill("wrong@toktickit.com");
    await page.locator("#login-password").fill("WrongPass123!");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await page.screenshot({ path: "artifacts/lab-03/screenshots/authentication/login-validation-error.png", fullPage: true });

    // 1.6 Mandatory Change Password Screen (Desktop)
    await page.getByLabel(/Email Address/i).fill(mustChangeUser.email);
    await page.locator("#login-password").fill("TempPassword123!");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByRole("heading", { name: "Password Change Required" })).toBeVisible();
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/authentication/change-password-desktop.png", fullPage: true });

    // 1.7 Real-time Complexity Checklist Active State
    const newPwdInput = page.locator("#new-password");
    await newPwdInput.fill("StrongPass123!");
    await page.screenshot({ path: "artifacts/lab-03/screenshots/authentication/change-password-complexity-checklist.png", fullPage: true });

    // 1.8 Change Password Mobile Viewport (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/authentication/change-password-mobile.png", fullPage: true });
  });

  test("2. Captures responsive visual evidence for IT Staff Ticket Queue", async ({ page }) => {
    let currentTickets = [...sampleTicketsList];

    await page.route("**/api/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      const json = (body: unknown, status = 200) =>
        route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

      if (url.pathname === "/api/auth/login" && req.method() === "POST") {
        return json({ token: "token-staff", user: staffUser });
      }

      if (url.pathname === "/api/auth/me") {
        return json(staffUser);
      }

      if (url.pathname === "/api/categories") {
        return json([category, { id: 2, name: "Network" }, { id: 3, name: "Software" }]);
      }

      if (url.pathname === "/api/staff/tickets") {
        const searchQuery = url.searchParams.get("search");
        const filteredTickets = (searchQuery === "NonExistentQueryXYZ" || currentTickets.length === 0)
          ? []
          : currentTickets;
        return json({
          tickets: filteredTickets,
          pagination: {
            total: filteredTickets.length,
            page: 1,
            limit: 10,
            totalPages: Math.max(1, Math.ceil(filteredTickets.length / 10)),
          },
        });
      }

      return json({}, 200);
    });

    // Login as Staff
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(staffUser.email);
    await page.locator("#login-password").fill("StaffPass123!");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByRole("heading", { name: "IT Staff Ticket Queue" })).toBeVisible();

    // 2.1 Desktop Viewport (1280px)
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-queue/queue-desktop.png", fullPage: true });

    // 2.2 Tablet Viewport (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-queue/queue-tablet.png", fullPage: true });

    // 2.3 Mobile Viewport (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-queue/queue-mobile.png", fullPage: true });

    // 2.4 Small Mobile Viewport (320px)
    await page.setViewportSize({ width: 320, height: 568 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-queue/queue-small-mobile.png", fullPage: true });

    // 2.5 Filters Active View (Desktop)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.getByRole("button", { name: "Assigned to Me" }).click();
    await page.getByLabel(/Filter by Category/i).selectOption("1");
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-queue/queue-filters-active.png", fullPage: true });

    // 2.6 Empty State View
    currentTickets = [];
    await page.getByLabel(/Search tickets/i).fill("NonExistentQueryXYZ");
    await expect(page.getByText(/No tickets found/i)).toBeVisible();
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-queue/queue-empty-state.png", fullPage: true });
  });

  test("3. Captures responsive visual evidence for IT Staff Ticket Detail", async ({ page }) => {
    let ticket = { ...sampleTicket };

    await page.route("**/api/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      const json = (body: unknown, status = 200) =>
        route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

      if (url.pathname === "/api/auth/login" && req.method() === "POST") {
        return json({ token: "token-staff", user: staffUser });
      }

      if (url.pathname === "/api/auth/me") {
        return json(staffUser);
      }

      if (url.pathname === "/api/categories") {
        return json([category]);
      }

      if (url.pathname === "/api/staff/users") {
        return json([staffUser, adminUser]);
      }

      if (url.pathname === "/api/staff/tickets") {
        return json({
          tickets: [ticket],
          pagination: {
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        });
      }

      if (url.pathname === "/api/staff/tickets/101") {
        return json({
          ...ticket,
          comments: publicComments,
          notes: internalNotes,
        });
      }

      if (url.pathname === "/api/tickets/101/comments") {
        return json(publicComments);
      }

      if (url.pathname === "/api/tickets/101/notes") {
        return json(internalNotes);
      }

      return json({}, 200);
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(staffUser.email);
    await page.locator("#login-password").fill("StaffPass123!");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByRole("heading", { name: "IT Staff Ticket Queue" })).toBeVisible();
    await page.getByRole("button", { name: ticket.ticketNumber }).click();
    await expect(page.getByRole("heading", { name: ticket.ticketNumber })).toBeVisible();

    // 3.1 Desktop Viewport (1280px)
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-ticket-detail/detail-desktop.png", fullPage: true });

    // 3.2 Tablet Viewport (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-ticket-detail/detail-tablet.png", fullPage: true });

    // 3.3 Mobile Viewport (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-ticket-detail/detail-mobile.png", fullPage: true });

    // 3.4 Small Mobile Viewport (320px)
    await page.setViewportSize({ width: 320, height: 568 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-ticket-detail/detail-small-mobile.png", fullPage: true });

    // 3.5 Public Comments Tab (Desktop)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.getByRole("tab", { name: /Public Comments/i }).click();
    await expect(page.getByText("I replaced the HDMI cable")).toBeVisible();
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-ticket-detail/public-comments-tab.png", fullPage: true });

    // 3.6 Internal Notes Tab (Amber styling with Lock Icon Banner)
    await page.getByRole("tab", { name: /Internal Notes/i }).click();
    await expect(page.getByText(/Confirmed dock firmware is v1.2/i)).toBeVisible();
    await expect(page.getByText(/Visible only to IT Staff/i)).toBeVisible();
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-ticket-detail/internal-notes-tab.png", fullPage: true });

    // 3.7 Resolve Ticket Modal (Resolution Summary requirement)
    await page.getByRole("button", { name: "Resolve Ticket" }).click();
    await expect(page.getByRole("heading", { name: /Resolve Ticket/i })).toBeVisible();
    await page.screenshot({ path: "artifacts/lab-03/screenshots/staff-ticket-detail/resolve-modal.png", fullPage: true });
  });

  test("4. Captures responsive visual evidence for Administrator User Management", async ({ page }) => {
    let users = [...sampleUsers];

    await page.route("**/api/**", async (route) => {
      const req = route.request();
      const url = new URL(req.url());
      const json = (body: unknown, status = 200) =>
        route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

      if (url.pathname === "/api/auth/login" && req.method() === "POST") {
        return json({ token: "token-admin", user: adminUser });
      }

      if (url.pathname === "/api/auth/me") {
        return json(adminUser);
      }

      if (url.pathname === "/api/admin/users") {
        return json(users);
      }

      return json({}, 200);
    });

    // Login as Admin
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(adminUser.email);
    await page.locator("#login-password").fill("AdminPass123!");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByRole("heading", { name: "User Management" })).toBeVisible();

    // 4.1 Desktop Viewport (1280px)
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/user-management/admin-roster-desktop.png", fullPage: true });

    // 4.2 Tablet Viewport (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/user-management/admin-roster-tablet.png", fullPage: true });

    // 4.3 Mobile Viewport (375px)
    await page.setViewportSize({ width: 375, height: 667 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/user-management/admin-roster-mobile.png", fullPage: true });

    // 4.4 Small Mobile Viewport (320px)
    await page.setViewportSize({ width: 320, height: 568 });
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: "artifacts/lab-03/screenshots/user-management/admin-roster-small-mobile.png", fullPage: true });

    // 4.5 Create User Modal (with password complexity checklist)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.getByRole("button", { name: "+ Create User" }).click();
    await expect(page.getByRole("heading", { name: "Create New User" })).toBeVisible();
    await page.locator("#create-password").fill("InitialPass123!");
    await page.screenshot({ path: "artifacts/lab-03/screenshots/user-management/create-user-modal.png", fullPage: true });
    await page.getByRole("button", { name: "Cancel" }).click();

    // 4.6 Edit User Modal - Self Protection (BR-07 & BR-08 Disabled Guards)
    const adminRow = page.getByRole("row").filter({ hasText: "Suda Administrator" });
    await adminRow.getByRole("button", { name: "Edit" }).click();
    await expect(page.getByText("Edit User: Suda Administrator")).toBeVisible();
    await expect(page.getByText(/Role cannot be changed for your own account \(BR-08\)/i)).toBeVisible();
    await expect(page.getByText(/You cannot deactivate your own account \(BR-07\)/i)).toBeVisible();
    await page.screenshot({ path: "artifacts/lab-03/screenshots/user-management/edit-user-modal-self.png", fullPage: true });
    await page.getByRole("button", { name: "Cancel" }).click();

    // 4.7 Reset Password Modal
    const staffRow = page.getByRole("row").filter({ hasText: "Somchai Staff" });
    await staffRow.getByRole("button", { name: "Reset Password" }).click();
    await expect(page.getByRole("heading", { name: /Reset Password: Somchai Staff/i })).toBeVisible();
    await page.locator("#new-initial-password").fill("NewTemp123!");
    await page.screenshot({ path: "artifacts/lab-03/screenshots/user-management/reset-password-modal.png", fullPage: true });
    await page.getByRole("button", { name: "Cancel" }).click();
  });
});
