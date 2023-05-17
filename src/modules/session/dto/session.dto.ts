import {
  IsEmail,
  IsEnum,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { UserRole } from 'src/common/constants/enums';

export class SessionResponseDto {
  @IsNotEmpty()
  @IsEnum(UserRole)
  type: UserRole;

  @IsNotEmpty()
  @IsUUID(4)
  userId: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  names: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsJWT()
  access_token: string;
}

export class SessionVerifyEmailOTPResponseDto {
  @IsUUID()
  emailVerificationToken: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  resetPasswordToken: string;
}
