import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { SeederService } from "./seeder.service";
import { UsersModule } from "../users/users.module";
import {
  Permission,
  PermissionSchema,
} from "../permissions/schemas/permission.schema";
import { Role, RoleSchema } from "../roles/schemas/role.schema";
import { User, UserSchema } from "../users/schemas/user.schema";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: parseInt(
            configService.get<string>("JWT_EXPIRATION", "3600"),
            10,
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, SeederService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
