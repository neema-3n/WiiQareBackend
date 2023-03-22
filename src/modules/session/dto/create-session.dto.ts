import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { transformPasswordToHash } from '../../../helpers/transform.helper';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  @Transform(transformPasswordToHash)
  readonly password: string;

  @IsOptional()
  @IsPhoneNumber()
  readonly phoneNumber: string;

  @IsOptional()
  @IsPhoneNumber()
  readonly username: string;

  @IsOptional()
  @IsString()
  readonly email: string;
}

export class SessionEmailVerifyRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
