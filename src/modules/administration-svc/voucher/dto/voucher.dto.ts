import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  ValidateNested,
} from 'class-validator';

class VoucherTotalsInfo {
  @IsNotEmpty()
  @IsNumber()
  numberOfVouchers: number;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}

export class VoucherSummaryDto {
  @ValidateNested()
  vouchersInOneWeek: VoucherTotalsInfo;

  @ValidateNested()
  vouchersInOneMonth: VoucherTotalsInfo;

  @ValidateNested()
  vouchersInThreeMonths: VoucherTotalsInfo;

  @ValidateNested()
  vouchersInSixMonths: VoucherTotalsInfo;

  @ValidateNested()
  vouchersInMaxTime: VoucherTotalsInfo;

  @ValidateNested()
  pendingVouchers: VoucherTotalsInfo;

  @ValidateNested()
  redeemedVouchers: VoucherTotalsInfo;

  @ValidateNested()
  unclaimedVouchers: VoucherTotalsInfo;

  @ValidateNested()
  claimedVouchers: VoucherTotalsInfo;
}

export class VoucherListDto {
  @IsOptional()
  @IsString()
  voucherId?: string;

  @IsOptional()
  @IsNumber()
  voucherValueLocal?: number;

  @IsOptional()
  @IsNumber()
  voucherValueEUR?: number;

  @IsOptional()
  @IsUUID()
  voucherPayerId?: string;

  @IsOptional()
  @IsUUID()
  voucherBeneficiaryId?: string;

  @IsOptional()
  @IsUUID()
  voucherOwnerId?: string;

  @IsOptional()
  @IsString()
  voucherStatus?: string;
}
