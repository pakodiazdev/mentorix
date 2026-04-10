import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  @IsNotEmpty()
  lastname!: string;

  @ApiProperty({ example: "P@ssw0rd!" })
  @IsString()
  @MinLength(8)
  @Matches(/\d/, {
    message: "password must contain at least 1 number",
  })
  @Matches(/[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/, {
    message: "password must contain at least 1 special character",
  })
  password!: string;
}
