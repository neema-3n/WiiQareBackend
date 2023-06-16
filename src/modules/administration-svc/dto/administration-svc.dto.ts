import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsEmail,
  IsString,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { UserRole, UserStatus } from 'src/common/constants/enums';

export class PayerSummaryDto {
  @IsNotEmpty()
  @IsNumber()
  numberOfRegisteredPayers: number;

  @IsNotEmpty()
  @IsNumber()
  totalNumberOfPurchasedVouchers: number;

  @IsNotEmpty()
  @IsNumber()
  totalNumberOfPendingVouchers: number;

  @IsNotEmpty()
  @IsNumber()
  totalNumberOfRedeemedVouchers: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfActivePayers: number;
}

export class createAdminAccountDTO {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class createAdminAccountReponseDTO {
  @IsNotEmpty()
  @IsUUID(4)
  userId: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  userRole: UserRole;

  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;
}
