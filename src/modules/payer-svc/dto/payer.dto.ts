import {
  IsEmail,
  IsISO31661Alpha2,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { transformPasswordToHash } from '../../../helpers/transform.helper';

export class CreatePayerAccountDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsUUID()
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
  @Transform(transformPasswordToHash)
  password: string;

  @IsNotEmpty()
  @IsISO31661Alpha2()
  country: string;
}
