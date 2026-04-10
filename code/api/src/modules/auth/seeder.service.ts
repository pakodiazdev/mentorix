import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as bcrypt from "bcryptjs";
import { Permission } from "../permissions/schemas/permission.schema";
import { Role } from "../roles/schemas/role.schema";
import { User } from "../users/schemas/user.schema";

interface PermissionDef {
  name: string;
  description: string;
  module: string;
}

interface RoleDef {
  name: string;
  permissions: string[];
}

const PERMISSIONS: PermissionDef[] = [
  { name: "user.create", description: "Create users", module: "users" },
  { name: "user.read", description: "Read users", module: "users" },
  { name: "user.update", description: "Update users", module: "users" },
  { name: "user.delete", description: "Delete users", module: "users" },
  { name: "role.create", description: "Create roles", module: "roles" },
  { name: "role.read", description: "Read roles", module: "roles" },
  { name: "role.update", description: "Update roles", module: "roles" },
  { name: "role.delete", description: "Delete roles", module: "roles" },
  {
    name: "permission.create",
    description: "Create permissions",
    module: "permissions",
  },
  {
    name: "permission.read",
    description: "Read permissions",
    module: "permissions",
  },
  {
    name: "permission.update",
    description: "Update permissions",
    module: "permissions",
  },
  {
    name: "permission.delete",
    description: "Delete permissions",
    module: "permissions",
  },
  {
    name: "policy.create",
    description: "Create policies",
    module: "policies",
  },
  { name: "policy.read", description: "Read policies", module: "policies" },
  {
    name: "policy.update",
    description: "Update policies",
    module: "policies",
  },
  {
    name: "policy.delete",
    description: "Delete policies",
    module: "policies",
  },
  {
    name: "auth.secrets.rotate",
    description: "Rotate auth secrets",
    module: "auth",
  },
  {
    name: "auth.impersonate.request",
    description: "Request impersonation",
    module: "auth",
  },
  { name: "auth.logs.read", description: "Read auth logs", module: "auth" },
  { name: "auth.login", description: "Login", module: "auth" },
  { name: "auth.google", description: "Google OAuth", module: "auth" },
  { name: "auth.refresh", description: "Refresh token", module: "auth" },
];

const ROLES: RoleDef[] = [
  {
    name: "admin",
    permissions: [
      "user.create",
      "user.read",
      "user.update",
      "user.delete",
      "role.create",
      "role.read",
      "role.update",
      "role.delete",
      "permission.create",
      "permission.read",
      "permission.update",
      "permission.delete",
      "policy.create",
      "policy.read",
      "policy.update",
      "policy.delete",
      "auth.secrets.rotate",
    ],
  },
  {
    name: "manager",
    permissions: [
      "user.read",
      "user.update",
      "role.read",
      "permission.read",
      "policy.read",
    ],
  },
  {
    name: "operator",
    permissions: ["user.read", "user.create", "auth.impersonate.request"],
  },
  {
    name: "auditor",
    permissions: ["user.read", "role.read", "policy.read", "auth.logs.read"],
  },
  {
    name: "guest",
    permissions: ["auth.login", "auth.google", "auth.refresh"],
  },
];

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const shouldSeed = this.configService.get<string>("SEED_DB", "false");
    if (shouldSeed !== "true") return;

    this.logger.log("Seeding database...");
    const permissionMap = await this.seedPermissions();
    const roleMap = await this.seedRoles(permissionMap);
    await this.seedAdminUser(roleMap);
    this.logger.log("Database seeding complete");
  }

  private async seedPermissions(): Promise<Map<string, Types.ObjectId>> {
    const map = new Map<string, Types.ObjectId>();

    for (const perm of PERMISSIONS) {
      const existing = await this.permissionModel
        .findOne({ name: perm.name })
        .exec();
      if (existing) {
        map.set(perm.name, existing._id);
      } else {
        const created = await this.permissionModel.create(perm);
        map.set(perm.name, created._id);
        this.logger.log(`Created permission: ${perm.name}`);
      }
    }

    return map;
  }

  private async seedRoles(
    permissionMap: Map<string, Types.ObjectId>,
  ): Promise<Map<string, Types.ObjectId>> {
    const map = new Map<string, Types.ObjectId>();

    for (const roleDef of ROLES) {
      const permIds = roleDef.permissions
        .map((name) => permissionMap.get(name))
        .filter((id): id is Types.ObjectId => id !== undefined);

      const existing = await this.roleModel
        .findOne({ name: roleDef.name })
        .exec();
      if (existing) {
        map.set(roleDef.name, existing._id);
      } else {
        const created = await this.roleModel.create({
          name: roleDef.name,
          permissions: permIds,
        });
        map.set(roleDef.name, created._id);
        this.logger.log(`Created role: ${roleDef.name}`);
      }
    }

    return map;
  }

  private async seedAdminUser(
    roleMap: Map<string, Types.ObjectId>,
  ): Promise<void> {
    const adminEmail = this.configService.getOrThrow<string>("ADMIN_EMAIL");
    const adminPassword =
      this.configService.getOrThrow<string>("ADMIN_PASSWORD");

    const existing = await this.userModel.findOne({ email: adminEmail }).exec();
    if (existing) return;

    const adminRoleId = roleMap.get("admin");
    if (!adminRoleId) return;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await this.userModel.create({
      email: adminEmail,
      name: "Admin",
      lastname: "Mentorix",
      password: hashedPassword,
      roles: [adminRoleId],
    });

    this.logger.log(`Created admin user: ${adminEmail}`);
  }
}
