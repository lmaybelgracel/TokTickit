import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// The Express app is exported separately from app.listen() (see index.ts) so
// Supertest can import `app` without opening a port. Do not merge these files.
export const app = express();

app.use(cors());          // lets the Vite dev server call this API
app.use(express.json());

// Issue 2 — API health check
app.get("/api/health", (req: Request, res: Response, next: NextFunction) => {
  if (req.query.simulate_error === "true") {
    return next(new Error("Database connection failure"));
  }
  res.status(200).json({ status: "ok", service: "TokTickIT API" });
});

// Centralized error handling middleware
app.use((_err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
