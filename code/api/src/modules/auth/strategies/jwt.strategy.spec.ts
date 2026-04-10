import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { UsersService } from "../../users/users.service";

const mockUsersService = {
  findById: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue("test-jwt-secret"),
};

const mockUser = {
  _id: "507f1f77bcf86cd799439011",
  email: "john@example.com",
  name: "John",
  lastname: "Doe",
};

describe("JwtStrategy", () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(strategy).toBeDefined();
  });

  describe("validate", () => {
    it("should return user when token payload is valid", async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await strategy.validate({
        sub: "507f1f77bcf86cd799439011",
        email: "john@example.com",
      });

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findById).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011",
      );
    });

    it("should throw UnauthorizedException when user not found", async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(
        strategy.validate({ sub: "nonexistent", email: "x@x.com" }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
