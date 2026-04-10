import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { UsersService } from "./users.service";
import { User } from "./schemas/user.schema";

const mockUserModel = {
  findOne: jest.fn().mockReturnValue({
    populate: jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
  }),
  findById: jest.fn().mockReturnValue({
    populate: jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
  }),
  create: jest.fn(),
};

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findByEmail", () => {
    it("should return null when user not found", async () => {
      mockUserModel.findOne.mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });

      const result = await service.findByEmail("notfound@example.com");
      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should return null when user not found", async () => {
      mockUserModel.findById.mockReturnValue({
        populate: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });

      const result = await service.findById("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("validatePassword", () => {
    it("should return false for mismatched password", async () => {
      const validHash = await import("bcryptjs").then((b) =>
        b.hashSync("correct", 10),
      );
      const result = await service.validatePassword("wrong", validHash);
      expect(result).toBe(false);
    });
  });
});
