import { expect, test } from "@playwright/test";

test.describe("E2E-ADMIN: Administrator User Management & Safety Guards Flow", () => {
  const adminUser = {
    id: 1,
    name: "Suda Administrator",
    email: "admin@toktickit.com",
    role: "ADMINISTRATOR",
    isActive: true,
    mustChangePassword: false,
  };

  const staffUser = {
    id: 10,
    name: "Somchai Staff",
    email: "somchai.it@toktickit.com",
    role: "IT_STAFF",
    isActive: true,
    mustChangePassword: false,
  };

  const requesterUser = {
    id: 20,
    name: "Alice Requester",
    email: "alice@example.com",
    role: "REQUESTER",
    isActive: true,
    mustChangePassword: false,
  };

  test("E2E-ADMIN-01: admin logs in, views roster, creates user, resets password, and verifies BR-07/08 safety guards", async ({ page }) => {
    let usersList: any[] = [
      { ...adminUser, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { ...staffUser, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { ...requesterUser, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];

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

      if (url.pathname === "/api/auth/logout") {
        return json({ message: "Logged out" });
      }

      if (url.pathname === "/api/admin/users" && req.method() === "GET") {
        const search = url.searchParams.get("search")?.toLowerCase();
        let filtered = [...usersList];
        if (search) {
          filtered = filtered.filter(
            (u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)
          );
        }
        return json(filtered);
      }

      if (url.pathname === "/api/admin/users" && req.method() === "POST") {
        const body = JSON.parse(req.postData() || "{}");
        const newUser = {
          id: 30,
          name: body.name,
          email: body.email,
          role: body.role,
          isActive: body.isActive ?? true,
          mustChangePassword: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        usersList.push(newUser);
        return json(newUser, 201);
      }

      if (url.pathname.startsWith("/api/admin/users/") && url.pathname.endsWith("/reset-password") && req.method() === "POST") {
        return json({ message: "Password reset successfully" });
      }

      if (url.pathname.startsWith("/api/admin/users/") && req.method() === "PATCH") {
        const id = parseInt(url.pathname.split("/").pop() || "0", 10);
        const body = JSON.parse(req.postData() || "{}");
        const idx = usersList.findIndex((u) => u.id === id);
        if (idx !== -1) {
          usersList[idx] = { ...usersList[idx], ...body };
          return json(usersList[idx]);
        }
      }

      return json({ error: "Not found" }, 404);
    });

    // 1. Admin logs in
    await page.goto("/");
    await page.getByLabel(/Email Address/i).fill(adminUser.email);
    await page.locator("#login-password").fill("AdminPassword123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    // 2. User Management view is displayed
    await expect(page.getByRole("heading", { name: "User Management" })).toBeVisible();
    await expect(page.getByLabel("Users List").getByText("Suda Administrator")).toBeVisible();
    await expect(page.getByLabel("Users List").getByText("Somchai Staff")).toBeVisible();

    // 3. Filter/Search users
    const searchInput = page.getByPlaceholder(/Search by name or email/i);
    await searchInput.fill("Somchai");
    await expect(page.getByLabel("Users List").getByText("Somchai Staff")).toBeVisible();
    await searchInput.clear();

    // 4. Create New User
    await page.getByRole("button", { name: /\+ Create User/i }).click();
    await expect(page.getByText("Create New User Account")).toBeVisible();

    await page.getByLabel(/Full Name \*/i).fill("Kanok DevOps");
    await page.getByLabel(/Email Address \*/i).fill("kanok@toktickit.com");
    await page.getByLabel(/^Role \*/i).selectOption("IT_STAFF");

    const pwdInput = page.getByLabel(/Initial Temporary Password \*/i);
    const submitBtn = page.getByRole("button", { name: /Create Account/i });
    expect(await submitBtn.isDisabled()).toBe(true);

    await pwdInput.fill("DevOpsPass123!");
    expect(await submitBtn.isDisabled()).toBe(false);
    await submitBtn.click();

    await expect(page.getByText(/User created successfully with temporary password/i)).toBeVisible();

    // 5. Reset Password for a user
    const staffRow = page.getByRole("row").filter({ hasText: "Somchai Staff" });
    await staffRow.getByRole("button", { name: "Reset Password" }).click();
    await expect(page.getByRole("heading", { name: /Reset Password: Somchai Staff/i })).toBeVisible();

    const resetPwdInput = page.getByLabel(/New Initial Password \*/i);
    await resetPwdInput.fill("NewTempPass123!");
    await page.getByRole("button", { name: /Confirm & Reset Password/i }).click();
    await expect(page.getByText(/Password for somchai.it@toktickit.com has been reset/i)).toBeVisible();

    // 6. Test Edit Modal safety guards on current admin (BR-07, BR-08)
    const adminRow = page.getByRole("row").filter({ hasText: "Suda Administrator" });
    await adminRow.getByRole("button", { name: /Edit/i }).click();
    await expect(page.getByText("Edit User: Suda Administrator")).toBeVisible();

    const editRole = page.getByLabel(/^Role \*/i);
    const editActive = page.getByRole("dialog").locator("input[type='checkbox']");

    expect(await editRole.isDisabled()).toBe(true);
    expect(await editActive.isDisabled()).toBe(true);
    await expect(page.getByText(/Role cannot be changed for your own account \(BR-08\)/i)).toBeVisible();
    await expect(page.getByText(/You cannot deactivate your own account \(BR-07\)/i)).toBeVisible();

    await page.getByRole("button", { name: /Cancel/i }).click();

    // 7. Sign Out
    await page.getByRole("button", { name: /Sign Out/i }).click();
    await expect(page.getByRole("heading", { name: "TokTickIT" })).toBeVisible();
  });
});
