import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsPhoneNumber()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsPhoneNumber()
  readonly username?: string;

  @IsOptional()
  @IsString()
  readonly email?: string;
}

export class SessionEmailVerifyRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SessionVerifyEmailOTPRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  otpCode: number;
}
