import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { PermissionsModule } from "./modules/permissions/permissions.module";
import { RolesModule } from "./modules/roles/roles.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URI"),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
  ],
})
export class AppModule {}
