import {
  IsEmail,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

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
