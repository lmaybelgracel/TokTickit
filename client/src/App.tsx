import { useState } from "react";
import { checkSystem, Category } from "./api.js";

type UiState = "idle" | "loading" | "success" | "error";

export default function App() {
  const [state, setState] = useState<UiState>("idle");
  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleCheck() {
    setState("loading");
    try {
      const res = await checkSystem();
      setCategories(res.categories);
      setState("success");
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to connect to TokTickIT API");
      setState("error");
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <h1 className="h3 fw-bold mb-4 text-dark d-flex align-items-center gap-2">
            <span>TokTickIT</span>
            <span className="badge bg-success-subtle text-success border border-success-subtle fs-6 rounded-pill px-3">
              IT Service Desk
            </span>
          </h1>

          <div className="mb-4">
            <button
              className="btn btn-success btn-lg px-4 rounded-pill shadow-sm"
              onClick={handleCheck}
              disabled={state === "loading"}
            >
              {state === "loading" ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  loading…
                </span>
              ) : (
                "Check System"
              )}
            </button>
          </div>

          {state === "success" && (
            <div className="mt-4 pt-3 border-top">
              <div className="mb-3 fs-5 fw-medium">
                System Status: <span className="badge bg-success px-3 py-2 rounded-pill fs-6 ms-1">Online</span>
              </div>

              <div className="mt-4">
                <h2 className="h6 text-secondary text-uppercase tracking-wider fw-bold mb-3">
                  Supported Request Categories
                </h2>
                <ol className="list-group list-group-numbered shadow-sm rounded-3">
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 fw-medium"
                    >
                      <span>{cat.name}</span>
                      <span className="badge bg-light text-dark rounded-pill border">ID: {cat.id}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {state === "error" && (
            <div className="mt-4 pt-3 border-top">
              <div className="mb-3 fs-5 fw-medium">
                System Status: <span className="badge bg-danger px-3 py-2 rounded-pill fs-6 ms-1">Offline</span>
              </div>
              <div className="alert alert-danger rounded-3 shadow-sm border-danger-subtle d-flex align-items-center" role="alert">
                <div>{errorMessage}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
