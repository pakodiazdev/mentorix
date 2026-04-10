import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { RolesService } from "./roles.service";
import { Role } from "./schemas/role.schema";

const mockRoleModel = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

describe("RolesService", () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getModelToken(Role.name), useValue: mockRoleModel },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return all roles with populated permissions", async () => {
      const roles = [{ name: "admin" }, { name: "guest" }];
      mockRoleModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(roles),
        }),
      });

      const result = await service.findAll();
      expect(result).toEqual(roles);
    });
  });

  describe("findByName", () => {
    it("should return a role by name", async () => {
      const role = { name: "admin" };
      mockRoleModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(role),
        }),
      });

      const result = await service.findByName("admin");
      expect(result).toEqual(role);
    });

    it("should return null when role not found", async () => {
      mockRoleModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      const result = await service.findByName("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("createIfNotExists", () => {
    it("should return existing role", async () => {
      const existing = { name: "admin" };
      mockRoleModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(existing),
        }),
      });

      const result = await service.createIfNotExists("admin", []);
      expect(result).toEqual(existing);
      expect(mockRoleModel.create).not.toHaveBeenCalled();
    });

    it("should create new role when not exists", async () => {
      const permIds = [new Types.ObjectId()];
      const created = { name: "manager", permissions: permIds };
      mockRoleModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });
      mockRoleModel.create.mockResolvedValue(created);

      const result = await service.createIfNotExists("manager", permIds);
      expect(result).toEqual(created);
      expect(mockRoleModel.create).toHaveBeenCalledWith({
        name: "manager",
        permissions: permIds,
      });
    });
  });
});
