import React, { useState, useEffect, useMemo } from "react";
import { User, fetchAdminUsers, createAdminUser, updateAdminUser, resetAdminUserPassword } from "../api";
import { useAuth } from "../context/AuthContext";
import "./AdminUserManagement.css";

export const AdminUserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resettingUser, setResettingUser] = useState<User | null>(null);

  // Form states - Create User
  const [createName, setCreateName] = useState<string>("");
  const [createEmail, setCreateEmail] = useState<string>("");
  const [createRole, setCreateRole] = useState<string>("REQUESTER");
  const [createPassword, setCreatePassword] = useState<string>("");
  const [createIsActive, setCreateIsActive] = useState<boolean>(true);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState<boolean>(false);

  // Form states - Edit User
  const [editName, setEditName] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");
  const [editRole, setEditRole] = useState<string>("REQUESTER");
  const [editIsActive, setEditIsActive] = useState<boolean>(true);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);

  // Form states - Reset Password
  const [newPassword, setNewPassword] = useState<string>("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [isSubmittingReset, setIsSubmittingReset] = useState<boolean>(false);

  // Count active administrators to enforce BR-09
  const activeAdminCount = useMemo(() => {
    return users.filter((u) => u.role === "ADMINISTRATOR" && u.isActive).length;
  }, [users]);

  // Load users
  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminUsers({
        search: searchQuery || undefined,
        role: roleFilter || undefined,
        isActive: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
      });
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load user list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadUsers();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, roleFilter, statusFilter]);

  // Password complexity validator
  const checkComplexity = (pwd: string) => ({
    hasMinLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
  });

  const createComplexity = checkComplexity(createPassword);
  const isCreatePasswordValid =
    createComplexity.hasMinLength &&
    createComplexity.hasUpper &&
    createComplexity.hasLower &&
    createComplexity.hasNumber;

  const resetComplexity = checkComplexity(newPassword);
  const isResetPasswordValid =
    resetComplexity.hasMinLength &&
    resetComplexity.hasUpper &&
    resetComplexity.hasLower &&
    resetComplexity.hasNumber;

  // Handle Create User
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim() || !createEmail.trim()) {
      setCreateError("Name and email are required");
      return;
    }
    if (!isCreatePasswordValid) {
      setCreateError("Password does not meet all complexity requirements");
      return;
    }

    setIsSubmittingCreate(true);
    setCreateError(null);
    try {
      await createAdminUser({
        name: createName.trim(),
        email: createEmail.trim(),
        role: createRole,
        initialPassword: createPassword,
        isActive: createIsActive,
      });

      setIsCreateOpen(false);
      setCreateName("");
      setCreateEmail("");
      setCreateRole("REQUESTER");
      setCreatePassword("");
      setCreateIsActive(true);
      setSuccessMessage("User created successfully with temporary password.");
      await loadUsers();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create user");
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // Open Edit User Modal
  const openEditModal = (target: User) => {
    setEditingUser(target);
    setEditName(target.name);
    setEditEmail(target.email);
    setEditRole(target.role);
    setEditIsActive(target.isActive ?? true);
    setEditError(null);
  };

  // Handle Edit User
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editName.trim() || !editEmail.trim()) {
      setEditError("Name and email are required");
      return;
    }

    setIsSubmittingEdit(true);
    setEditError(null);
    try {
      await updateAdminUser(editingUser.id, {
        name: editName.trim(),
        email: editEmail.trim(),
        role: editRole,
        isActive: editIsActive,
      });

      setEditingUser(null);
      setSuccessMessage(`User "${editName.trim()}" updated successfully.`);
      await loadUsers();
    } catch (err: any) {
      setEditError(err.message || "Failed to update user");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Open Reset Password Modal
  const openResetModal = (target: User) => {
    setResettingUser(target);
    setNewPassword("");
    setResetError(null);
  };

  // Handle Reset Password
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser) return;

    if (!isResetPasswordValid) {
      setResetError("New password does not meet all complexity requirements");
      return;
    }

    setIsSubmittingReset(true);
    setResetError(null);
    try {
      await resetAdminUserPassword(resettingUser.id, newPassword);
      setResettingUser(null);
      setSuccessMessage(`Password for ${resettingUser.email} has been reset. User must change it on next login.`);
      await loadUsers();
    } catch (err: any) {
      setResetError(err.message || "Failed to reset password");
    } finally {
      setIsSubmittingReset(false);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "ADMINISTRATOR") return <span className="role-badge role-badge--admin">Administrator</span>;
    if (role === "IT_STAFF") return <span className="role-badge role-badge--staff">IT Staff</span>;
    return <span className="role-badge role-badge--requester">Requester</span>;
  };

  return (
    <div className="admin-mgmt" data-testid="admin-user-management">
      {/* Header */}
      <header className="admin-mgmt__header">
        <div className="admin-mgmt__title-area">
          <h1>User Management</h1>
          <p className="admin-mgmt__subtitle">
            Manage system users, roles, account status, and credentials ({users.length} total users)
          </p>
        </div>
        <button
          type="button"
          className="admin-mgmt__btn-create"
          onClick={() => {
            setIsCreateOpen(true);
            setCreateError(null);
          }}
        >
          + Create User
        </button>
      </header>

      {/* Notifications */}
      {successMessage && (
        <div className="admin-mgmt__alert admin-mgmt__alert--success" role="status">
          {successMessage}
          <button
            type="button"
            style={{ float: "right", background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => setSuccessMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="admin-mgmt__alert admin-mgmt__alert--error" role="alert">
          {error}
        </div>
      )}

      {/* Toolbar: Search and Filter Controls */}
      <section className="admin-mgmt__toolbar" aria-label="User Filters">
        <div className="admin-mgmt__search-box">
          <span className="admin-mgmt__search-icon">🔍</span>
          <input
            type="text"
            className="admin-mgmt__search-input"
            aria-label="Search users"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="admin-mgmt__filter-group">
          <label htmlFor="role-filter" className="admin-mgmt__filter-label">
            Role:
          </label>
          <select
            id="role-filter"
            className="admin-mgmt__select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="REQUESTER">Requester</option>
            <option value="IT_STAFF">IT Staff</option>
            <option value="ADMINISTRATOR">Administrator</option>
          </select>
        </div>

        <div className="admin-mgmt__filter-group">
          <label htmlFor="status-filter" className="admin-mgmt__filter-label">
            Status:
          </label>
          <select
            id="status-filter"
            className="admin-mgmt__select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </section>

      {/* Desktop User Table */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#5A6E63" }}>
          Loading user roster...
        </div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E0E6E2" }}>
          <p style={{ color: "#5A6E63", fontSize: "1rem" }}>No users match the current search or filters.</p>
          {(searchQuery || roleFilter || statusFilter) && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("");
                setStatusFilter("");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="admin-mgmt__table-container">
            <table className="admin-mgmt__table" aria-label="Users List">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Credentials</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = currentUser?.id === u.id;
                  return (
                    <tr key={u.id}>
                      <td>
                        <span className="admin-mgmt__user-name">{u.name}</span>
                        {isSelf && (
                          <span style={{ fontSize: "0.7rem", color: "#006B3C", fontWeight: 700, marginLeft: "0.4rem" }}>
                            (You)
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="admin-mgmt__user-email">{u.email}</span>
                      </td>
                      <td>{getRoleBadge(u.role)}</td>
                      <td>
                        {u.isActive ? (
                          <span className="status-badge status-badge--active">Active</span>
                        ) : (
                          <span className="status-badge status-badge--inactive">Inactive</span>
                        )}
                      </td>
                      <td>
                        {u.mustChangePassword ? (
                          <span className="flag-badge">Must Change Password</span>
                        ) : (
                          <span style={{ color: "#7A9084", fontSize: "0.75rem" }}>Active Password</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-mgmt__actions">
                          <button
                            type="button"
                            className="admin-mgmt__btn-edit"
                            onClick={() => openEditModal(u)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="admin-mgmt__btn-reset"
                            onClick={() => openResetModal(u)}
                          >
                            Reset Password
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Stack */}
          <div className="admin-mgmt__cards">
            {users.map((u) => {
              const isSelf = currentUser?.id === u.id;
              return (
                <article key={u.id} className="admin-mgmt__card">
                  <div className="admin-mgmt__card-top">
                    <div>
                      <strong style={{ fontSize: "1rem" }}>{u.name}</strong>
                      {isSelf && (
                        <span style={{ fontSize: "0.75rem", color: "#006B3C", fontWeight: 700, marginLeft: "0.3rem" }}>
                          (You)
                        </span>
                      )}
                      <div style={{ color: "#5A6E63", fontSize: "0.85rem", marginTop: "0.15rem" }}>{u.email}</div>
                    </div>
                    {getRoleBadge(u.role)}
                  </div>
                  <div className="admin-mgmt__card-meta">
                    Status: {u.isActive ? "Active" : "Inactive"} ·{" "}
                    {u.mustChangePassword ? "Must Change Password" : "Password Active"}
                  </div>
                  <div className="admin-mgmt__card-actions">
                    <button
                      type="button"
                      className="admin-mgmt__btn-edit"
                      style={{ flex: 1 }}
                      onClick={() => openEditModal(u)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-mgmt__btn-reset"
                      style={{ flex: 1 }}
                      onClick={() => openResetModal(u)}
                    >
                      Reset Password
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* Modal 1: Create User */}
      {isCreateOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="create-user-title">
          <div className="modal-card">
            <header className="modal-header">
              <h2 id="create-user-title" className="modal-title">
                Create New User Account
              </h2>
            </header>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                {createError && (
                  <div className="admin-mgmt__alert admin-mgmt__alert--error" role="alert">
                    {createError}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="create-name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    id="create-name"
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Alex Thompson"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="create-email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    id="create-email"
                    type="email"
                    className="form-input"
                    required
                    placeholder="e.g. alex.thompson@toktickit.com"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="create-role" className="form-label">
                    Role *
                  </label>
                  <select
                    id="create-role"
                    className="form-input"
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value)}
                  >
                    <option value="REQUESTER">Requester</option>
                    <option value="IT_STAFF">IT Staff</option>
                    <option value="ADMINISTRATOR">Administrator</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="create-password" className="form-label">
                    Initial Temporary Password *
                  </label>
                  <input
                    id="create-password"
                    type="password"
                    className="form-input"
                    required
                    placeholder="Enter initial password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                  />
                  <div className="complexity-list">
                    <span className={`complexity-item ${createComplexity.hasMinLength ? "complexity-item--valid" : ""}`}>
                      {createComplexity.hasMinLength ? "✓" : "○"} At least 8 characters long
                    </span>
                    <span className={`complexity-item ${createComplexity.hasUpper ? "complexity-item--valid" : ""}`}>
                      {createComplexity.hasUpper ? "✓" : "○"} At least one uppercase letter (A-Z)
                    </span>
                    <span className={`complexity-item ${createComplexity.hasLower ? "complexity-item--valid" : ""}`}>
                      {createComplexity.hasLower ? "✓" : "○"} At least one lowercase letter (a-z)
                    </span>
                    <span className={`complexity-item ${createComplexity.hasNumber ? "complexity-item--valid" : ""}`}>
                      {createComplexity.hasNumber ? "✓" : "○"} At least one numeric digit (0-9)
                    </span>
                  </div>
                  <span className="form-helper">
                    New user will be forced to change this password on their first login.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      checked={createIsActive}
                      onChange={(e) => setCreateIsActive(e.target.checked)}
                    />
                    Active account
                  </label>
                </div>
              </div>

              <footer className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isSubmittingCreate}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmittingCreate || !isCreatePasswordValid || !createName.trim() || !createEmail.trim()}
                >
                  {isSubmittingCreate ? "Creating..." : "Create Account"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit User */}
      {editingUser && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-user-title">
          <div className="modal-card">
            <header className="modal-header">
              <h2 id="edit-user-title" className="modal-title">
                Edit User: {editingUser.name}
              </h2>
            </header>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                {editError && (
                  <div className="admin-mgmt__alert admin-mgmt__alert--error" role="alert">
                    {editError}
                  </div>
                )}

                {/* Safety Rule alerts */}
                {currentUser?.id === editingUser.id && (
                  <div className="form-helper--warn">
                    You are editing your own profile. Safety rules prevent deactivating your account (BR-07) or changing your role away from Administrator (BR-08).
                  </div>
                )}

                {currentUser?.id !== editingUser.id &&
                  editingUser.role === "ADMINISTRATOR" &&
                  editingUser.isActive &&
                  activeAdminCount <= 1 && (
                    <div className="form-helper--warn">
                      This user is the last active Administrator in the system. Safety rules prevent deactivating or demoting this account (BR-09).
                    </div>
                  )}

                <div className="form-group">
                  <label htmlFor="edit-name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    className="form-input"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    id="edit-email"
                    type="email"
                    className="form-input"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-role" className="form-label">
                    Role *
                  </label>
                  <select
                    id="edit-role"
                    className="form-input"
                    value={editRole}
                    disabled={
                      currentUser?.id === editingUser.id ||
                      (editingUser.role === "ADMINISTRATOR" && editingUser.isActive && activeAdminCount <= 1)
                    }
                    onChange={(e) => setEditRole(e.target.value)}
                  >
                    <option value="REQUESTER">Requester</option>
                    <option value="IT_STAFF">IT Staff</option>
                    <option value="ADMINISTRATOR">Administrator</option>
                  </select>
                  {currentUser?.id === editingUser.id && (
                    <span className="form-helper">Role cannot be changed for your own account (BR-08).</span>
                  )}
                  {currentUser?.id !== editingUser.id &&
                    editingUser.role === "ADMINISTRATOR" &&
                    editingUser.isActive &&
                    activeAdminCount <= 1 && (
                      <span className="form-helper">Cannot demote the last active Administrator (BR-09).</span>
                    )}
                </div>

                <div className="form-group">
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      checked={editIsActive}
                      disabled={
                        currentUser?.id === editingUser.id ||
                        (editingUser.role === "ADMINISTRATOR" && editingUser.isActive && activeAdminCount <= 1)
                      }
                      onChange={(e) => setEditIsActive(e.target.checked)}
                    />
                    Active account
                  </label>
                  {currentUser?.id === editingUser.id && (
                    <span className="form-helper">You cannot deactivate your own account (BR-07).</span>
                  )}
                  {currentUser?.id !== editingUser.id &&
                    editingUser.role === "ADMINISTRATOR" &&
                    editingUser.isActive &&
                    activeAdminCount <= 1 && (
                      <span className="form-helper">Cannot deactivate the last active Administrator (BR-09).</span>
                    )}
                </div>
              </div>

              <footer className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingUser(null)}
                  disabled={isSubmittingEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmittingEdit || !editName.trim() || !editEmail.trim()}
                >
                  {isSubmittingEdit ? "Saving..." : "Save Changes"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Reset Password */}
      {resettingUser && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reset-pwd-title">
          <div className="modal-card">
            <header className="modal-header">
              <h2 id="reset-pwd-title" className="modal-title">
                Reset Password: {resettingUser.name}
              </h2>
            </header>
            <form onSubmit={handleResetSubmit}>
              <div className="modal-body">
                {resetError && (
                  <div className="admin-mgmt__alert admin-mgmt__alert--error" role="alert">
                    {resetError}
                  </div>
                )}

                <p style={{ fontSize: "0.875rem", color: "#5A6E63", margin: "0" }}>
                  Enter a new temporary password for <strong>{resettingUser.email}</strong>. The user will be required to change this password upon their next login.
                </p>

                <div className="form-group">
                  <label htmlFor="new-initial-password" className="form-label">
                    New Initial Password *
                  </label>
                  <input
                    id="new-initial-password"
                    type="password"
                    className="form-input"
                    required
                    placeholder="Enter new initial password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <div className="complexity-list">
                    <span className={`complexity-item ${resetComplexity.hasMinLength ? "complexity-item--valid" : ""}`}>
                      {resetComplexity.hasMinLength ? "✓" : "○"} At least 8 characters long
                    </span>
                    <span className={`complexity-item ${resetComplexity.hasUpper ? "complexity-item--valid" : ""}`}>
                      {resetComplexity.hasUpper ? "✓" : "○"} At least one uppercase letter (A-Z)
                    </span>
                    <span className={`complexity-item ${resetComplexity.hasLower ? "complexity-item--valid" : ""}`}>
                      {resetComplexity.hasLower ? "✓" : "○"} At least one lowercase letter (a-z)
                    </span>
                    <span className={`complexity-item ${resetComplexity.hasNumber ? "complexity-item--valid" : ""}`}>
                      {resetComplexity.hasNumber ? "✓" : "○"} At least one numeric digit (0-9)
                    </span>
                  </div>
                </div>
              </div>

              <footer className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setResettingUser(null)}
                  disabled={isSubmittingReset}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmittingReset || !isResetPasswordValid}
                >
                  {isSubmittingReset ? "Resetting..." : "Confirm & Reset Password"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
