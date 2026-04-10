import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { User } from "./schemas/user.schema";
import { RegisterDto } from "../auth/dto/register.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).populate("roles").exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).populate("roles").exec();
  }

  async create(dto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.userModel.create({
      email: dto.email,
      name: dto.name,
      lastname: dto.lastname,
      password: hashedPassword,
      roles: [],
    });
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
