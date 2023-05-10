import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BusinessType } from '../../../common/constants/enums';

export class ContactPersonDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  occupation: string;

  @IsNotEmpty()
  @IsISO31661Alpha2()
  country: string;

  @IsOptional()
  @IsString()
  homeAddress?: string;
}

export class RegisterProviderDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  logo: any;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  emailVerificationToken: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  nationalId: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  businessRegistrationNo: number;

  @IsNotEmpty()
  @IsEnum(BusinessType)
  businessType: BusinessType;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ContactPersonDto)
  contactPerson: ContactPersonDto;
}

export class ProviderValidateEmailDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
