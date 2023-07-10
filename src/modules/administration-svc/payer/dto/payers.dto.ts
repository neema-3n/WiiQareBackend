import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  ValidateNested,
} from 'class-validator';

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

class PayerVouchersInfo {
  @IsNotEmpty()
  @IsNumber()
  numberOfVouchers: number;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}

export class PayerListDto {
  @IsOptional()
  @IsUUID()
  payerId?: string;

  @IsOptional()
  @IsString()
  payerName?: string;

  @IsOptional()
  @IsString()
  payerCountry?: string;

  @IsOptional()
  @IsDateString()
  registredDate?: Date;

  @IsOptional()
  @IsDateString()
  lastActivityOn?: string;

  @IsOptional()
  @IsNumber()
  totalBeneficiaries?: number;

  @ValidateNested()
  purchasedVouchers?: PayerVouchersInfo;

  @ValidateNested()
  pendingVouchers?: PayerVouchersInfo;

  @ValidateNested()
  unclaimedVouchers?: PayerVouchersInfo;

  @ValidateNested()
  redeemedVouchers?: PayerVouchersInfo;
}
