import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Permission } from "./schemas/permission.schema";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.find().exec();
  }

  async findByName(name: string): Promise<Permission | null> {
    return this.permissionModel.findOne({ name }).exec();
  }

  async createIfNotExists(
    name: string,
    description?: string,
    module?: string,
  ): Promise<Permission> {
    const existing = await this.findByName(name);
    if (existing) return existing;
    return this.permissionModel.create({ name, description, module });
  }
}
