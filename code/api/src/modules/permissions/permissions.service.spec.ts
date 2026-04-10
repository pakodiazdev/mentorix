import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { PermissionsService } from "./permissions.service";
import { Permission } from "./schemas/permission.schema";

const mockPermissionModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

describe("PermissionsService", () => {
  let service: PermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getModelToken(Permission.name),
          useValue: mockPermissionModel,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return all permissions", async () => {
      const permissions = [{ name: "user.read" }, { name: "user.create" }];
      mockPermissionModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(permissions),
      });

      const result = await service.findAll();
      expect(result).toEqual(permissions);
    });
  });

  describe("findByName", () => {
    it("should return a permission by name", async () => {
      const permission = { name: "user.read" };
      mockPermissionModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(permission),
      });

      const result = await service.findByName("user.read");
      expect(result).toEqual(permission);
    });

    it("should return null when not found", async () => {
      mockPermissionModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findByName("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("createIfNotExists", () => {
    it("should return existing permission", async () => {
      const existing = { name: "user.read" };
      mockPermissionModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existing),
      });

      const result = await service.createIfNotExists("user.read");
      expect(result).toEqual(existing);
      expect(mockPermissionModel.create).not.toHaveBeenCalled();
    });

    it("should create new permission when not exists", async () => {
      const created = {
        name: "user.read",
        description: "Read users",
        module: "users",
      };
      mockPermissionModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      mockPermissionModel.create.mockResolvedValue(created);

      const result = await service.createIfNotExists(
        "user.read",
        "Read users",
        "users",
      );
      expect(result).toEqual(created);
      expect(mockPermissionModel.create).toHaveBeenCalledWith({
        name: "user.read",
        description: "Read users",
        module: "users",
      });
    });
  });
});
