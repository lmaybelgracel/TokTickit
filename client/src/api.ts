const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface RelatedSystem {
  id: number;
  name: string;
  category?: string;
}

export interface RequesterUser {
  id: number;
  name: string;
  email: string;
  department: string;
  isActive: boolean;
}

export interface SystemStatus {
  status: string;
  service: string;
  categories: Category[];
}

export async function checkSystem(): Promise<SystemStatus> {
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  if (!healthRes.ok) {
    throw new Error("Unable to connect to TokTickIT API");
  }
  const healthData = await healthRes.json();

  const categoriesRes = await fetch(`${BASE_URL}/api/categories`);
  if (!categoriesRes.ok) {
    throw new Error("Unable to connect to TokTickIT API");
  }
  const categoriesData = await categoriesRes.json();

  return {
    status: healthData.status === "ok" ? "Online" : "Offline",
    service: healthData.service || "TokTickIT API",
    categories: categoriesData,
  };
}

export interface Ticket {
  id: number;
  ticketNumber: string;
  summary: string;
  description: string;
  requestedPriority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  itPriority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  currentStatus: string;
  resolutionSummary?: string | null;
  resolvedAt?: string | null;
  requesterResolvedIndication?: boolean;
  requesterIndicatedResolved?: boolean;
  requesterId: number;
  categoryId: number;
  relatedSystemId: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  relatedSystem?: RelatedSystem;
  requester?: Pick<RequesterUser, "id" | "name" | "email">;
  ownerId?: number | null;
  owner?: { id: number; name: string; email: string; role?: string } | null;
  attachments?: Attachment[];
}

export interface Attachment {
  id: number; ticketId: number; filename: string; fileSize: number; mimeType: string;
  isRemoved: boolean; uploadedAt: string; removedAt?: string | null; removalReason?: string | null;
}

export interface CreateTicketPayload {
  categoryId: number;
  relatedSystemId: number;
  requestedPriority: "LOW" | "MEDIUM" | "HIGH";
  summary: string;
  description: string;
  attachments?: File[];
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/api/categories`);
  if (!res.ok) {
    throw new Error("Failed to load categories");
  }
  return res.json();
}

export async function fetchRelatedSystems(): Promise<RelatedSystem[]> {
  const res = await fetch(`${BASE_URL}/api/related-systems`);
  if (!res.ok) {
    throw new Error("Failed to load related systems");
  }
  return res.json();
}

export async function fetchRequesters(): Promise<RequesterUser[]> {
  const res = await fetch(`${BASE_URL}/api/requesters`);
  if (!res.ok) {
    throw new Error("Failed to load Development Requesters");
  }
  return res.json();
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface FetchTicketsParams {
  search?: string;
  category?: string;
  priority?: string;
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchMyTickets(
  requesterId: number,
  params: FetchTicketsParams = {}
): Promise<PaginatedResponse<Ticket>> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", params.category);
  if (params.priority) query.set("priority", params.priority);
  if (params.status) query.set("status", params.status);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", params.page.toString());
  if (params.pageSize) query.set("pageSize", params.pageSize.toString());

  const queryString = query.toString() ? `?${query.toString()}` : "";

  const res = await fetch(`${BASE_URL}/api/tickets${queryString}`, {
    headers: {
      "X-Development-Requester-Id": requesterId.toString(),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load tickets");
  }

  return res.json();
}

export async function createTicket(
  requesterId: number,
  payload: CreateTicketPayload
): Promise<Ticket> {
  const hasAttachments = Boolean(payload.attachments?.length);
  let body: BodyInit;
  const headers: Record<string, string> = {
    "X-Development-Requester-Id": requesterId.toString(),
  };

  if (hasAttachments) {
    const form = new FormData();
    form.append("categoryId", String(payload.categoryId));
    form.append("relatedSystemId", String(payload.relatedSystemId));
    form.append("requestedPriority", payload.requestedPriority);
    form.append("summary", payload.summary);
    form.append("description", payload.description);
    payload.attachments?.forEach((file) => form.append("attachments", file));
    body = form;
  } else {
    headers["Content-Type"] = "application/json";
    const { attachments: _attachments, ...ticketFields } = payload;
    body = JSON.stringify(ticketFields);
  }

  const res = await fetch(`${BASE_URL}/api/tickets`, {
    method: "POST",
    headers,
    body,
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data.error?.message || "Failed to create ticket";
    const details = data.error?.details || [];
    const error = new Error(errorMsg) as any;
    error.details = details;
    error.code = data.error?.code;
    throw error;
  }

  return data;
}

async function apiError(res: Response, fallback: string): Promise<Error> {
  const data = await res.json().catch(() => ({}));
  return new Error(data.error?.message || fallback);
}

export async function fetchTicketDetail(requesterId: number, ticketId: number): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}`, { headers: { "X-Development-Requester-Id": String(requesterId) } });
  if (!res.ok) throw await apiError(res, "Failed to load ticket detail");
  return res.json();
}

export async function uploadAttachment(requesterId: number, ticketId: number, file: File): Promise<Attachment> {
  const body = new FormData(); body.append("file", file);
  const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}/attachments`, { method: "POST", headers: { "X-Development-Requester-Id": String(requesterId) }, body });
  if (!res.ok) throw await apiError(res, "Failed to upload attachment");
  return res.json();
}

export async function removeAttachment(requesterId: number, attachmentId: number, removalReason: string): Promise<Attachment> {
  const res = await fetch(`${BASE_URL}/api/attachments/${attachmentId}`, { method: "DELETE", headers: { "Content-Type": "application/json", "X-Development-Requester-Id": String(requesterId) }, body: JSON.stringify({ removalReason }) });
  if (!res.ok) throw await apiError(res, "Failed to remove attachment");
  return res.json();
}

export async function downloadAttachment(requesterId: number, attachment: Attachment): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/attachments/${attachment.id}/download`, { headers: { "X-Development-Requester-Id": String(requesterId) } });
  if (!res.ok) throw await apiError(res, "Failed to download attachment");
  const url = URL.createObjectURL(await res.blob());
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = attachment.filename; anchor.click();
  URL.revokeObjectURL(url);
}

// Sprint 3 — Issue 19: Authentication & Session APIs
export type UserRole = "REQUESTER" | "IT_STAFF" | "ADMINISTRATOR";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  mustChangePassword: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function loginUser(credentials: { email: string; password: string }): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }
  return data;
}

export async function logoutUser(token?: string): Promise<void> {
  await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function fetchCurrentUser(token: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch user profile");
  }
  return data;
}

export async function changePassword(
  payload: ChangePasswordPayload,
  token: string
): Promise<{ message: string; mustChangePassword: boolean }> {
  const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.details
      ? `${data.error}: ${data.details.join(", ")}`
      : data.error || "Failed to change password";
    throw new Error(errorMsg);
  }
  return data;
}

export interface FetchStaffTicketsParams {
  search?: string;
  category?: string | number;
  status?: string;
  priority?: string;
  itPriority?: string;
  ownerId?: string | number;
  sort?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface StaffQueueResponse {
  tickets: Ticket[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchStaffTickets(
  params: FetchStaffTicketsParams = {},
  token?: string | null
): Promise<StaffQueueResponse> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category) query.set("category", String(params.category));
  if (params.status) query.set("status", params.status);
  if (params.priority) query.set("priority", params.priority);
  if (params.itPriority) query.set("itPriority", params.itPriority);
  if (params.ownerId !== undefined && params.ownerId !== null && String(params.ownerId) !== "") {
    query.set("ownerId", String(params.ownerId));
  }
  if (params.sort) query.set("sort", params.sort);
  if (params.order) query.set("order", params.order);
  if (params.page) query.set("page", params.page.toString());
  if (params.limit) query.set("limit", params.limit.toString());

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const res = await fetch(`${BASE_URL}/api/staff/tickets${queryString}`, {
    headers: {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to load staff ticket queue");
  }

  return res.json();
}

export interface PublicComment {
  id: number;
  ticketId: number;
  authorId: number;
  content: string;
  createdAt: string;
  author: { id: number; name: string; email: string; role: string };
}

export interface InternalNote {
  id: number;
  ticketId: number;
  authorId: number;
  content: string;
  createdAt: string;
  author: { id: number; name: string; email: string; role: string };
}

export interface StaffUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export async function fetchStaffTicketDetail(ticketId: number, token?: string | null): Promise<Ticket & { comments?: PublicComment[]; notes?: InternalNote[] }> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const res = await fetch(`${BASE_URL}/api/staff/tickets/${ticketId}`, {
    headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to load ticket details");
  }
  return res.json();
}

export async function fetchStaffUsers(token?: string | null): Promise<StaffUser[]> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const res = await fetch(`${BASE_URL}/api/staff/users`, {
    headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to load staff roster");
  }
  return res.json();
}

export async function claimTicket(ticketId: number, token?: string | null): Promise<Ticket> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const res = await fetch(`${BASE_URL}/api/staff/tickets/${ticketId}/claim`, {
    method: "PATCH",
    headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to claim ticket");
  }
  return res.json();
}

export async function assignTicket(ticketId: number, ownerId: number, token?: string | null): Promise<Ticket> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const res = await fetch(`${BASE_URL}/api/staff/tickets/${ticketId}/assign`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ ownerId }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to assign ticket");
  }
  return res.json();
}

export async function updateItPriority(ticketId: number, itPriority: string, token?: string | null): Promise<Ticket> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const res = await fetch(`${BASE_URL}/api/staff/tickets/${ticketId}/priority`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ itPriority }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to update IT Priority");
  }
  return res.json();
}

export async function updateTicketStatus(ticketId: number, status: string, token?: string | null): Promise<Ticket> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const res = await fetch(`${BASE_URL}/api/staff/tickets/${ticketId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to update ticket status");
  }
  return res.json();
}

export async function resolveTicket(ticketId: number, resolutionSummary: string, token?: string | null): Promise<Ticket> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const res = await fetch(`${BASE_URL}/api/staff/tickets/${ticketId}/resolve`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ resolutionSummary }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to resolve ticket");
  }
  return res.json();
}

export async function fetchTicketComments(ticketId: number, token?: string | null, requesterId?: number): Promise<PublicComment[]> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const headers: Record<string, string> = {};
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  if (requesterId) headers["X-Development-Requester-Id"] = String(requesterId);
  const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}/comments`, {
    headers,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to load comments");
  }
  return res.json();
}

export async function addTicketComment(ticketId: number, content: string, token?: string | null, requesterId?: number): Promise<PublicComment> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  if (requesterId) headers["X-Development-Requester-Id"] = String(requesterId);
  const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}/comments`, {
    method: "POST",
    headers,
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to post comment");
  }
  return res.json();
}

export async function fetchTicketNotes(ticketId: number, token?: string | null): Promise<InternalNote[]> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}/notes`, {
    headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to load internal notes");
  }
  return res.json();
}

export async function addTicketNote(ticketId: number, content: string, token?: string | null): Promise<InternalNote> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to add internal note");
  }
  return res.json();
}

export async function indicateTicketResolved(ticketId: number, appearsResolved = true, token?: string | null, requesterId?: number): Promise<Ticket> {
  const authToken = token || localStorage.getItem("toktickit_auth_token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  if (requesterId) headers["X-Development-Requester-Id"] = String(requesterId);
  const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}/resolve-indication`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ appearsResolved }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to update resolution indication");
  }
  return res.json();
}

