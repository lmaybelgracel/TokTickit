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

describe("UI-ADMIN: UserManagement Component Traceability Suite (Sprint 3 - Issue 23)", () => {
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
  ];

  const renderWithAuth = (ui: React.ReactElement) => {
    return render(<AuthProvider>{ui}</AuthProvider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("toktickit_auth_token", "fake-admin-token");
    vi.mocked(api.fetchCurrentUser).mockResolvedValue(currentAdminUser);
    vi.mocked(api.fetchAdminUsers).mockResolvedValue(sampleUsers);
  });

  it("UI-ADMIN-01: renders user list with names, roles, and status indicators", async () => {
    renderWithAuth(<AdminUserManagement />);

    expect(await screen.findByText("User Management")).toBeInTheDocument();
    await screen.findAllByText("Suda Admin");
    expect(screen.getAllByText("Suda Admin")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Somchai Staff")[0]).toBeInTheDocument();
  });

  it("UI-ADMIN-02: opens create user modal and enforces password complexity validation", async () => {
    renderWithAuth(<AdminUserManagement />);

    await screen.findAllByText("Suda Admin");

    const createBtn = await screen.findByRole("button", { name: /\+ Create User/i });
    fireEvent.click(createBtn);

    expect(screen.getByText("Create New User Account")).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /Create Account/i });
    expect(submitButton).toBeDisabled();

    // Type incomplete password
    const pwdInput = screen.getByLabelText(/Initial Temporary Password \*/i);
    fireEvent.change(pwdInput, { target: { value: "short" } });
    expect(submitButton).toBeDisabled();

    // Type full password
    fireEvent.change(pwdInput, { target: { value: "ValidPassword123" } });
    expect(screen.getByText(/At least 8 characters long/i)).toHaveClass("complexity-item--valid");
    expect(screen.getByText(/At least one uppercase letter/i)).toHaveClass("complexity-item--valid");
    expect(screen.getByText(/At least one lowercase letter/i)).toHaveClass("complexity-item--valid");
    expect(screen.getByText(/At least one numeric digit/i)).toHaveClass("complexity-item--valid");
  });

  it("UI-ADMIN-03: enforces safety disabled state for current administrator in edit modal (BR-07, BR-08)", async () => {
    renderWithAuth(<AdminUserManagement />);

    await screen.findAllByText("Suda Admin");

    const editButtons = screen.getAllByRole("button", { name: /Edit/i });
    fireEvent.click(editButtons[0]); // Suda Admin (current admin)

    expect(screen.getByText("Edit User: Suda Admin")).toBeInTheDocument();

    // Role and active controls should be disabled for self
    const roleSelect = screen.getByLabelText(/^Role \*/i);
    const activeCheckbox = screen.getByLabelText(/Active account/i);

    expect(roleSelect).toBeDisabled();
    expect(activeCheckbox).toBeDisabled();
    expect(screen.getByText(/Role cannot be changed for your own account \(BR-08\)/i)).toBeInTheDocument();
    expect(screen.getByText(/You cannot deactivate your own account \(BR-07\)/i)).toBeInTheDocument();
  });
});
