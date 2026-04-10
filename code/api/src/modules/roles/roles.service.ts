import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Role } from "./schemas/role.schema";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().populate("permissions").exec();
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleModel.findOne({ name }).populate("permissions").exec();
  }

  async createIfNotExists(
    name: string,
    permissionIds: Types.ObjectId[],
  ): Promise<Role> {
    const existing = await this.findByName(name);
    if (existing) return existing;
    return this.roleModel.create({ name, permissions: permissionIds });
  }
}
