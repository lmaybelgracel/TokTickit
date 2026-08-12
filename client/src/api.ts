const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface Category {
  id: number;
  name: string;
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
