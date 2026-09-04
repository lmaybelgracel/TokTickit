import { expect, test, type Route } from "@playwright/test";

const requesterA = { id: 1, name: "Pae Karn", email: "pae.karn@example.com", department: "Engineering", isActive: true };
const requesterB = { id: 2, name: "Miki Chan", email: "miki.chan@example.com", department: "Information Technology", isActive: true };
const category = { id: 1, name: "Hardware", description: "Devices" };
const system = { id: 1, name: "Corporate Laptop", category: "Hardware" };
const ticket = {
  id: 101,
  ticketNumber: "TKT-2026-000101",
  summary: "Laptop battery drains quickly",
  description: "Battery drains within one hour during normal use.",
  requestedPriority: "HIGH",
  currentStatus: "NEW",
  requesterId: 1,
  categoryId: 1,
  relatedSystemId: 1,
  createdAt: "2026-09-03T10:00:00Z",
  updatedAt: "2026-09-03T10:00:00Z",
  requester: requesterA,
  category,
  relatedSystem: system,
  attachments: [],
};

const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

test("captures Development Requester loading, empty, and failure evidence", async ({ page }) => {
  let requesterMode: "loading" | "empty" | "failure" = "loading";

  await page.route("**/api/requesters", async (route) => {
    if (requesterMode === "loading") {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return json(route, [requesterA, requesterB]);
    }
    if (requesterMode === "failure") return json(route, { error: { message: "Development Requesters are temporarily unavailable." } }, 503);
    return json(route, []);
  });

  await page.goto("/");
  await expect(page.getByTestId("loading-state")).toBeVisible();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/create-ticket/requester-loading.png", fullPage: true });
  await expect(page.getByRole("button", { name: "Continue to Application" })).toBeVisible();

  requesterMode = "empty";
  await page.reload();
  await expect(page.getByTestId("empty-state")).toBeVisible();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/create-ticket/requester-empty.png", fullPage: true });

  requesterMode = "failure";
  await page.reload();
  await expect(page.getByTestId("error-state")).toBeVisible();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/create-ticket/requester-api-failure.png", fullPage: true });
});

test("captures Create Ticket invalid file, API failure, submitting, and success evidence", async ({ page }) => {
  let createMode: "failure" | "success" = "failure";

  await page.route("**/api/**", async (route) => {
    const { pathname } = new URL(route.request().url());
    const method = route.request().method();
    if (pathname === "/api/requesters") return json(route, [requesterA, requesterB]);
    if (pathname === "/api/categories") return json(route, [category]);
    if (pathname === "/api/related-systems") return json(route, [system]);
    if (pathname === "/api/tickets" && method === "GET") return json(route, { data: [], pagination: { totalItems: 0, totalPages: 0, currentPage: 1, pageSize: 10 } });
    if (pathname === "/api/tickets" && method === "POST") {
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (createMode === "failure") return json(route, { error: { code: "SERVER_ERROR", message: "Unable to create ticket right now. Please try again." } }, 500);
      return json(route, ticket, 201);
    }
    return json(route, { error: { code: "NOT_FOUND" } }, 404);
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Continue to Application" }).click();
  await page.getByRole("navigation").getByRole("button", { name: "+ Create Ticket" }).click();
  await page.getByLabel("Summary", { exact: false }).fill(ticket.summary);
  await page.getByLabel("Description", { exact: false }).fill(ticket.description);

  const attachmentInput = page.getByLabel("Initial attachments");
  await attachmentInput.setInputFiles({ name: "unsafe.exe", mimeType: "application/x-msdownload", buffer: Buffer.from("not allowed") });
  await page.getByRole("button", { name: "Submit Ticket" }).click();
  await expect(page.getByText("Only JPG, PNG, WEBP, and PDF files are allowed.")).toBeVisible();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/create-ticket/invalid-attachment.png", fullPage: true });

  await attachmentInput.setInputFiles({ name: "diagnostic.pdf", mimeType: "application/pdf", buffer: Buffer.from("valid evidence") });
  await page.getByRole("button", { name: "Submit Ticket" }).click();
  await expect(page.getByRole("button", { name: "Submitting..." })).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("Unable to create ticket right now");
  await expect(page.getByLabel("Summary", { exact: false })).toHaveValue(ticket.summary);
  await page.screenshot({ path: "artifacts/lab-02/screenshots/create-ticket/api-failure-values-preserved.png", fullPage: true });

  createMode = "success";
  await page.getByRole("button", { name: "Submit Ticket" }).click();
  await expect(page.getByRole("button", { name: "Submitting..." })).toBeVisible();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/create-ticket/submitting.png", fullPage: true });
  await expect(page.getByText(/Success! Created ticket/)).toContainText(ticket.ticketNumber);
  await page.screenshot({ path: "artifacts/lab-02/screenshots/create-ticket/success-ticket-number.png", fullPage: true });
});

test("captures My Tickets empty, no-results, pagination, requester isolation, and forbidden detail evidence", async ({ page }) => {
  let listMode: "empty" | "list" = "empty";

  await page.route("**/api/**", async (route) => {
    const { pathname } = new URL(route.request().url());
    const requesterId = route.request().headers()["x-development-requester-id"];
    if (pathname === "/api/requesters") return json(route, [requesterA, requesterB]);
    if (pathname === "/api/categories") return json(route, [category]);
    if (pathname === "/api/related-systems") return json(route, [system]);
    if (pathname === "/api/tickets/101") return json(route, { error: { code: "FORBIDDEN_ACCESS", message: "You do not have permission to view this ticket." } }, 403);
    if (pathname === "/api/tickets") {
      if (requesterId === "2" || listMode === "empty") return json(route, { data: [], pagination: { totalItems: 0, totalPages: 0, currentPage: 1, pageSize: 10 } });
      return json(route, { data: [ticket], pagination: { totalItems: 21, totalPages: 3, currentPage: 1, pageSize: 10 } });
    }
    return json(route, { error: { code: "NOT_FOUND" } }, 404);
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Continue to Application" }).click();
  await expect(page.getByRole("heading", { name: "No Tickets Yet" })).toBeVisible();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/my-tickets/empty-state.png", fullPage: true });

  listMode = "list";
  await page.reload();
  await expect(page.getByText("Page 1 of 3 (21 tickets)")).toBeVisible();
  await page.getByLabel("Search by ticket number or summary").fill("missing ticket");
  listMode = "empty";
  await expect(page.getByRole("heading", { name: "No Tickets Found" })).toBeVisible();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/my-tickets/no-results.png", fullPage: true });

  listMode = "list";
  await page.getByRole("button", { name: "Clear Filters" }).first().click();
  await expect(page.getByText("Page 1 of 3 (21 tickets)")).toBeVisible();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/my-tickets/filters-sort-pagination.png", fullPage: true });

  await page.getByRole("row").filter({ hasText: ticket.ticketNumber }).getByRole("button", { name: "View detail" }).click();
  await expect(page.getByRole("alert")).toContainText("permission to view this ticket");
  await page.screenshot({ path: "artifacts/lab-02/screenshots/ticket-detail/forbidden-access.png", fullPage: true });

  await page.getByRole("button", { name: "Change" }).click();
  await page.getByLabel("Development Requester").selectOption("2");
  await page.getByRole("button", { name: "Continue to Application" }).click();
  await expect(page.getByText("Manage and track support tickets created by Miki Chan")).toBeVisible();
  await expect(page.getByRole("heading", { name: "No Tickets Yet" })).toBeVisible();
  await page.screenshot({ path: "artifacts/lab-02/screenshots/my-tickets/requester-b-isolation.png", fullPage: true });
});
