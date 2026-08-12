import { describe, it, expect } from "vitest";
import { app } from "../../src/app.js";

describe("Express Server Foundation", () => {
  it("initializes express app successfully", () => {
    expect(app).toBeDefined();
  });
});
