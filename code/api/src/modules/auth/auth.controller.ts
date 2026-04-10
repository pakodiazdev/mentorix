import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService, TokenPayload, UserDto } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { User } from "../users/schemas/user.schema";

interface AuthenticatedRequest {
  user: User;
}

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 409, description: "Email already registered" })
  async register(@Body() dto: RegisterDto): Promise<TokenPayload> {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: "Login with email and password" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(
    @Body() _dto: LoginDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TokenPayload> {
    return this.authService.login(req.user);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({ status: 200, description: "Token refreshed successfully" })
  @ApiResponse({
    status: 401,
    description: "Invalid or expired refresh token",
  })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokenPayload> {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "User profile" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getProfile(@Request() req: AuthenticatedRequest): Promise<UserDto> {
    return this.authService.getProfile(String(req.user._id));
  }
}
