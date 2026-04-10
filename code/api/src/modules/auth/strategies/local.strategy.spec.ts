import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { LocalStrategy } from "./local.strategy";
import { AuthService } from "../auth.service";

const mockAuthService = {
  validateUser: jest.fn(),
};

const mockUser = {
  _id: "507f1f77bcf86cd799439011",
  email: "john@example.com",
  name: "John",
};

describe("LocalStrategy", () => {
  let strategy: LocalStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    jest.clearAllMocks();
  });

  it("should return user when credentials are valid", async () => {
    mockAuthService.validateUser.mockResolvedValue(mockUser);

    const result = await strategy.validate("john@example.com", "password");
    expect(result).toEqual(mockUser);
  });

  it("should throw UnauthorizedException when credentials are invalid", async () => {
    mockAuthService.validateUser.mockResolvedValue(null);

    await expect(strategy.validate("bad@example.com", "wrong")).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
