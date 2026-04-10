import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { User } from "../users/schemas/user.schema";

export interface UserDto {
  id: string;
  email: string;
  name: string;
  lastname: string;
  roles: string[];
}

export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isValid) return null;

    return user;
  }

  async login(user: User): Promise<TokenPayload> {
    return this.generateTokens(user);
  }

  async register(dto: RegisterDto): Promise<TokenPayload> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const user = await this.usersService.create(dto);
    const populatedUser = await this.usersService.findById(String(user._id));

    return this.generateTokens(populatedUser!);
  }

  async refreshToken(refreshToken: string): Promise<TokenPayload> {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(
        refreshToken,
        {
          secret: this.configService.get<string>(
            "JWT_REFRESH_SECRET",
            "default_refresh_secret",
          ),
        },
      );

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException("refresh_token_revoked");
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException("token_invalid_or_expired");
    }
  }

  async getProfile(userId: string): Promise<UserDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException("token_invalid_or_expired");
    }
    return this.mapUserToDto(user);
  }

  private generateTokens(user: User): TokenPayload {
    const payload = {
      sub: String(user._id),
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        "JWT_REFRESH_SECRET",
        "default_refresh_secret",
      ),
      expiresIn: "7d" as const,
    });

    return {
      accessToken,
      refreshToken,
      user: this.mapUserToDto(user),
    };
  }

  private mapUserToDto(user: User): UserDto {
    const roles = (user.populated("roles") ? user.roles : []) as unknown as {
      name: string;
    }[];
    return {
      id: String(user._id),
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      roles: roles.map((role) => role.name),
    };
  }
}
