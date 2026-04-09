import { describe, it, expect, beforeEach } from "vitest";
import apiClient from "./api-client";

describe("apiClient", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should have the correct base URL", () => {
    expect(apiClient.defaults.baseURL).toBe("http://localhost:3000/api/v1");
  });

  it("should have Content-Type header set to application/json", () => {
    expect(apiClient.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("should add Authorization header when token exists", async () => {
    localStorage.setItem("token", "test-jwt-token");

    const handler = apiClient.interceptors.request.handlers[0].fulfilled;
    const config = await handler({
      headers: {} as Record<string, string>,
    } as Parameters<typeof handler>[0]);

    expect(config.headers.Authorization).toBe("Bearer test-jwt-token");
  });

  it("should not add Authorization header when no token exists", async () => {
    const handler = apiClient.interceptors.request.handlers[0].fulfilled;
    const config = await handler({
      headers: {} as Record<string, string>,
    } as Parameters<typeof handler>[0]);

    expect(config.headers.Authorization).toBeUndefined();
  });
});
