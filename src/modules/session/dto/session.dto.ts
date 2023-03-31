import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class SessionResponseDto {
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
