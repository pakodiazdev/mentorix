import { describe, it, expect } from "vitest";
import router from "./index";

describe("Router", () => {
  it("should have a home route", () => {
    const routes = router.getRoutes();
    const homeRoute = routes.find((r) => r.name === "home");
    expect(homeRoute).toBeDefined();
    expect(homeRoute?.path).toBe("/");
  });

  it("should use web history mode", () => {
    expect(router.options.history).toBeDefined();
  });
});
