import {
  IsArray,
  IsEmail,
  IsEnum,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { InviteType } from 'src/common/constants/enums';

export class CreatePayerAccountDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  emailVerificationToken: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsISO31661Alpha2()
  country: string;
}

export class SearchPatientDto {
  @IsOptional()
  @IsEmail()
  phoneNumber?: string;

  @IsOptional()
  @IsUUID()
  payerId?: string;
}

export class SendInviteDto {
  @IsNotEmpty()
  @IsEnum(InviteType)
  inviteType: InviteType;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  emails?: string[];

  @IsOptional()
  @IsArray()
  @IsPhoneNumber()
  phoneNumbers: string[];
}
