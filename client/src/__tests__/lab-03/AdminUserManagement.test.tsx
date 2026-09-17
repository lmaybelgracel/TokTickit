import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { AdminUserManagement } from "../../components/AdminUserManagement";
import { AuthProvider } from "../../context/AuthContext";
import * as api from "../../api";

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");
  return {
    ...actual,
    fetchAdminUsers: vi.fn(),
    createAdminUser: vi.fn(),
    updateAdminUser: vi.fn(),
    resetAdminUserPassword: vi.fn(),
    fetchCurrentUser: vi.fn(),
  };
});

describe("AdminUserManagement Component Tests (Sprint 3 - Issue 22)", () => {
  const currentAdminUser: api.User = {
    id: 1,
    name: "Suda Admin",
    email: "admin@toktickit.com",
    role: "ADMINISTRATOR",
    isActive: true,
    mustChangePassword: false,
  };

  const sampleUsers: api.User[] = [
    {
      id: 1,
      name: "Suda Admin",
      email: "admin@toktickit.com",
      role: "ADMINISTRATOR",
      isActive: true,
      mustChangePassword: false,
    },
    {
      id: 2,
      name: "Second Admin",
      email: "admin2@toktickit.com",
      role: "ADMINISTRATOR",
      isActive: true,
      mustChangePassword: false,
    },
    {
      id: 10,
      name: "Somchai Staff",
      email: "somchai@toktickit.com",
      role: "IT_STAFF",
      isActive: true,
      mustChangePassword: false,
    },
    {
      id: 20,
      name: "Alice Requester",
      email: "alice@example.com",
      role: "REQUESTER",
      isActive: false,
      mustChangePassword: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("toktickit_auth_token", "fake-admin-token");
    vi.mocked(api.fetchCurrentUser).mockResolvedValue(currentAdminUser);
    vi.mocked(api.fetchAdminUsers).mockResolvedValue(sampleUsers);
  });

  const renderComponent = () => {
    return render(
      <AuthProvider>
        <AdminUserManagement />
      </AuthProvider>
    );
  };

  it("renders user roster table with names, roles, statuses, and credential flags", async () => {
    renderComponent();

    const names = await screen.findAllByText("Suda Admin");
    expect(names.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("admin@toktickit.com").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Somchai Staff").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Alice Requester").length).toBeGreaterThanOrEqual(1);

    // Verify role badges
    expect(screen.getAllByText("Administrator").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("IT Staff").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Requester").length).toBeGreaterThanOrEqual(1);

    // Verify status badges
    expect(screen.getAllByText("Active").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Inactive").length).toBeGreaterThanOrEqual(1);

    // Verify Must Change Password flag
    expect(screen.getAllByText("Must Change Password").length).toBeGreaterThanOrEqual(1);
  });

  it("filters users via search input with debounce", async () => {
    renderComponent();

    await screen.findAllByText("Suda Admin");

    const searchInput = screen.getByLabelText(/Search users/i);
    fireEvent.change(searchInput, { target: { value: "Somchai" } });

    await waitFor(
      () => {
        expect(api.fetchAdminUsers).toHaveBeenCalledWith(
          expect.objectContaining({
            search: "Somchai",
          })
        );
      },
      { timeout: 1500 }
    );
  });

  it("filters users via role select dropdown", async () => {
    renderComponent();

    await screen.findAllByText("Suda Admin");

    const roleSelect = screen.getByLabelText(/Role:/i);
    fireEvent.change(roleSelect, { target: { value: "IT_STAFF" } });

    await waitFor(
      () => {
        expect(api.fetchAdminUsers).toHaveBeenCalledWith(
          expect.objectContaining({
            role: "IT_STAFF",
          })
        );
      },
      { timeout: 1500 }
    );
  });

  it("opens Create User modal and submits new user when valid", async () => {
    vi.mocked(api.createAdminUser).mockResolvedValue({
      id: 55,
      name: "New Engineer",
      email: "engineer@toktickit.com",
      role: "IT_STAFF",
      isActive: true,
      mustChangePassword: true,
    });

    renderComponent();

    const createBtn = await screen.findByRole("button", { name: /\+ Create User/i });
    fireEvent.click(createBtn);

    // Modal title
    expect(screen.getByText("Create New User Account")).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Full Name \*/i);
    const emailInput = screen.getByLabelText(/Email Address \*/i);
    const roleSelect = screen.getByLabelText(/^Role \*/i);
    const passwordInput = screen.getByLabelText(/Initial Temporary Password \*/i);
    const submitBtn = screen.getByRole("button", { name: /Create Account/i });

    // Submit button disabled before valid password
    expect(submitBtn).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "New Engineer" } });
    fireEvent.change(emailInput, { target: { value: "engineer@toktickit.com" } });
    fireEvent.change(roleSelect, { target: { value: "IT_STAFF" } });
    fireEvent.change(passwordInput, { target: { value: "InitialPass123!" } });

    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.createAdminUser).toHaveBeenCalledWith({
        name: "New Engineer",
        email: "engineer@toktickit.com",
        role: "IT_STAFF",
        initialPassword: "InitialPass123!",
        isActive: true,
      });
    });
  });

  it("enforces BR-07 & BR-08 in Edit Modal: disables deactivation and role change when editing self", async () => {
    renderComponent();

    // User 1 is Suda Admin (current logged-in user)
    await screen.findAllByText("Suda Admin");

    // Click Edit button on Suda's row
    const editButtons = screen.getAllByRole("button", { name: /Edit/i });
    fireEvent.click(editButtons[0]);

    // Modal opens for self
    expect(screen.getByText("Edit User: Suda Admin")).toBeInTheDocument();
    expect(screen.getByText(/You are editing your own profile/i)).toBeInTheDocument();

    const roleSelect = screen.getByLabelText(/^Role \*/i);
    const activeCheckbox = screen.getByLabelText(/Active account/i);

    // Disabled per BR-07 and BR-08
    expect(roleSelect).toBeDisabled();
    expect(activeCheckbox).toBeDisabled();
    expect(screen.getByText(/Role cannot be changed for your own account \(BR-08\)/i)).toBeInTheDocument();
    expect(screen.getByText(/You cannot deactivate your own account \(BR-07\)/i)).toBeInTheDocument();
  });

  it("enforces BR-09 in Edit Modal: disables deactivation and demotion when editing the last active Administrator", async () => {
    // Only 1 active administrator
    const singleAdminUsers: api.User[] = [
      {
        id: 1,
        name: "Sole Admin",
        email: "admin@toktickit.com",
        role: "ADMINISTRATOR",
        isActive: true,
        mustChangePassword: false,
      },
      {
        id: 10,
        name: "Staff User",
        email: "staff@toktickit.com",
        role: "IT_STAFF",
        isActive: true,
        mustChangePassword: false,
      },
    ];
    vi.mocked(api.fetchAdminUsers).mockResolvedValue(singleAdminUsers);

    // Current user is Staff (viewing admin or simulating edit of Sole Admin)
    vi.mocked(api.fetchCurrentUser).mockResolvedValue({
      id: 99,
      name: "Temporary Observer",
      email: "observer@toktickit.com",
      role: "ADMINISTRATOR",
      isActive: true,
      mustChangePassword: false,
    });

    renderComponent();

    await screen.findAllByText("Sole Admin");
    const editBtns = screen.getAllByRole("button", { name: /Edit/i });
    fireEvent.click(editBtns[0]);

    // Modal opens for Sole Admin
    expect(screen.getByText("Edit User: Sole Admin")).toBeInTheDocument();
    expect(screen.getByText(/This user is the last active Administrator/i)).toBeInTheDocument();

    const roleSelect = screen.getByLabelText(/^Role \*/i);
    const activeCheckbox = screen.getByLabelText(/Active account/i);

    // Disabled per BR-09
    expect(roleSelect).toBeDisabled();
    expect(activeCheckbox).toBeDisabled();
    expect(screen.getByText(/Cannot demote the last active Administrator \(BR-09\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Cannot deactivate the last active Administrator \(BR-09\)/i)).toBeInTheDocument();
  });

  it("updates another user's name and role successfully", async () => {
    vi.mocked(api.updateAdminUser).mockResolvedValue({
      id: 10,
      name: "Somchai Promoted",
      email: "somchai@toktickit.com",
      role: "ADMINISTRATOR",
      isActive: true,
      mustChangePassword: false,
    });

    renderComponent();

    await screen.findAllByText("Somchai Staff");

    // Click Edit on Somchai (index 2 in sampleUsers)
    const editButtons = screen.getAllByRole("button", { name: /Edit/i });
    fireEvent.click(editButtons[2]);

    expect(screen.getByText("Edit User: Somchai Staff")).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Full Name \*/i);
    const roleSelect = screen.getByLabelText(/^Role \*/i);
    const submitBtn = screen.getByRole("button", { name: /Save Changes/i });

    expect(roleSelect).not.toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "Somchai Promoted" } });
    fireEvent.change(roleSelect, { target: { value: "ADMINISTRATOR" } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.updateAdminUser).toHaveBeenCalledWith(10, {
        name: "Somchai Promoted",
        email: "somchai@toktickit.com",
        role: "ADMINISTRATOR",
        isActive: true,
      });
    });
  });

  it("opens Reset Password modal and resets credentials", async () => {
    vi.mocked(api.resetAdminUserPassword).mockResolvedValue({
      message: "Password reset successfully",
    });

    renderComponent();

    await screen.findAllByText("Somchai Staff");

    // Click Reset Password for Somchai (index 2 in sampleUsers)
    const resetButtons = screen.getAllByRole("button", { name: /Reset Password/i });
    fireEvent.click(resetButtons[2]);

    expect(screen.getByText("Reset Password: Somchai Staff")).toBeInTheDocument();

    const newPwdInput = screen.getByLabelText(/New Initial Password \*/i);
    const confirmBtn = screen.getByRole("button", { name: /Confirm & Reset Password/i });

    expect(confirmBtn).toBeDisabled();

    fireEvent.change(newPwdInput, { target: { value: "NewTempPassword123!" } });

    expect(confirmBtn).not.toBeDisabled();

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(api.resetAdminUserPassword).toHaveBeenCalledWith(10, "NewTempPassword123!");
    });
  });
});
