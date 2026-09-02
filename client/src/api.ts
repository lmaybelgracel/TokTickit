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
  requestedPriority: "LOW" | "MEDIUM" | "HIGH";
  currentStatus: string;
  requesterId: number;
  categoryId: number;
  relatedSystemId: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  relatedSystem?: RelatedSystem;
}

export interface CreateTicketPayload {
  categoryId: number;
  relatedSystemId: number;
  requestedPriority: "LOW" | "MEDIUM" | "HIGH";
  summary: string;
  description: string;
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
  const res = await fetch(`${BASE_URL}/api/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Development-Requester-Id": requesterId.toString(),
    },
    body: JSON.stringify(payload),
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


