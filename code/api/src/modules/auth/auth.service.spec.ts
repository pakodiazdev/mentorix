import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";

const mockUser = {
  _id: "507f1f77bcf86cd799439011",
  email: "john@example.com",
  name: "John",
  lastname: "Doe",
  password: "$2a$10$hashedpassword",
  roles: [],
  populated: jest.fn().mockReturnValue(false),
};

const mockUsersService = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  validatePassword: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue("mock-token"),
  verify: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue("test-secret"),
};

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe("validateUser", () => {
    it("should return user when credentials are valid", async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(true);

      const result = await service.validateUser("john@example.com", "password");
      expect(result).toEqual(mockUser);
    });

    it("should return null when user not found", async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(
        "notfound@example.com",
        "password",
      );
      expect(result).toBeNull();
    });

    it("should return null when password is invalid", async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockUsersService.validatePassword.mockResolvedValue(false);

      const result = await service.validateUser("john@example.com", "wrong");
      expect(result).toBeNull();
    });
  });

  describe("register", () => {
    it("should throw ConflictException when email exists", async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: "john@example.com",
          name: "John",
          lastname: "Doe",
          password: "P@ssw0rd!",
        }),
      ).rejects.toThrow(ConflictException);
    });

    it("should create user and return tokens", async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.register({
        email: "new@example.com",
        name: "New",
        lastname: "User",
        password: "P@ssw0rd!",
      });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(result.user.email).toBe("john@example.com");
    });
  });

  describe("login", () => {
    it("should return tokens for valid user", async () => {
      const result = await service.login(mockUser as never);

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(result.user.id).toBe("507f1f77bcf86cd799439011");
    });
  });

  describe("refreshToken", () => {
    it("should throw UnauthorizedException for invalid token", async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error("invalid");
      });

      await expect(service.refreshToken("invalid-token")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should throw UnauthorizedException when user not found", async () => {
      mockJwtService.verify.mockReturnValue({
        sub: "nonexistent",
        email: "x@x.com",
      });
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.refreshToken("valid-token")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should return new tokens for valid refresh token", async () => {
      mockJwtService.verify.mockReturnValue({
        sub: "507f1f77bcf86cd799439011",
        email: "john@example.com",
      });
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.refreshToken("valid-refresh-token");
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
    });
  });

  describe("getProfile", () => {
    it("should throw UnauthorizedException when user not found", async () => {
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.getProfile("nonexistent")).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should return user profile", async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await service.getProfile("507f1f77bcf86cd799439011");
      expect(result.email).toBe("john@example.com");
      expect(result.name).toBe("John");
    });
  });
});
