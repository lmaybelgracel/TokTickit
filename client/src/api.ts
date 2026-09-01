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

export async function fetchRequesters(): Promise<RequesterUser[]> {
  const res = await fetch(`${BASE_URL}/api/requesters`);
  if (!res.ok) {
    throw new Error("Failed to load Development Requesters");
  }
  return res.json();
}
