import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";

describe("RolesGuard", () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const createMockContext = (user?: {
    roles: { name: string }[];
  }): ExecutionContext =>
    ({
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as unknown as ExecutionContext;

  it("should allow access when no roles are required", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);
    const context = createMockContext();

    expect(guard.canActivate(context)).toBe(true);
  });

  it("should allow access when user has required role", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["admin"]);
    const context = createMockContext({
      roles: [{ name: "admin" }],
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it("should throw ForbiddenException when user lacks required role", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["admin"]);
    const context = createMockContext({
      roles: [{ name: "guest" }],
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it("should throw ForbiddenException when user has no roles", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["admin"]);
    const context = createMockContext({ roles: [] });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it("should throw ForbiddenException when no user in request", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["admin"]);
    const context = createMockContext();

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
