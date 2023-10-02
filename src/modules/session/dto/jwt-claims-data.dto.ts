import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { UserRole, UserStatus } from '../../../common/constants/enums';

export class JwtClaimsDataDto {
  @IsUUID()
  @IsNotEmpty()
  sub: string;

  @IsNotEmpty()
  type: UserRole;

  @IsOptional()
  phoneNumber: string;

  @IsNotEmpty()
  names: string;

  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;
}

export class DashboardJwtClaimsDataDto {
  @IsUUID()
  @IsNotEmpty()
  sub: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  type: UserRole;

  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;
}
