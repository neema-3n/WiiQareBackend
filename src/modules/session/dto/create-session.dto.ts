import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateSessionDto {

  @IsNotEmpty()
  @IsString()
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
