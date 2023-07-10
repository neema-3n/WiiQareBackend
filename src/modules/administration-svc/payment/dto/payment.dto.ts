import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  ValidateNested,
  IsBoolean,
} from 'class-validator';

class PaymentTotalsInfo {
  @IsNotEmpty()
  @IsNumber()
  numberOfPayments: number;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}

export class PaymentSummaryDto {
  @ValidateNested()
  payerPaymentsInOneWeek: PaymentTotalsInfo;

  @ValidateNested()
  payerPaymentsInOneMonth: PaymentTotalsInfo;

  @ValidateNested()
  payerPaymentsInThreeMonths: PaymentTotalsInfo;

  @ValidateNested()
  payerPaymentsInSixMonths: PaymentTotalsInfo;

  @ValidateNested()
  payerPaymentsMax: PaymentTotalsInfo;

  @ValidateNested()
  claimedVouchers: PaymentTotalsInfo;

  // @ValidateNested()
  // providerPayments: PaymentTotalsInfo;

  // @IsNotEmpty()
  // @IsNumber()
  // totalRevenue: number;
}

export class PaymentsPayerListDto {
  @IsOptional()
  @IsUUID()
  transactionId?: string;

  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @IsOptional()
  @IsNumber()
  paymentValue?: number;

  @IsOptional()
  @IsDateString()
  countryPayer?: string;

  @IsOptional()
  @IsDateString()
  countryBeneficiary?: string;
}

export class PaymentsProviderListDto {
  @IsOptional()
  @IsUUID()
  transactionId?: string;

  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @IsOptional()
  @IsString()
  providerName?: string;

  @IsOptional()
  @IsUUID()
  providerId?: string;

  @IsOptional()
  @IsString()
  cityProvider?: string;

  @IsOptional()
  @IsString()
  providerCountry?: string;

  // @IsOptional()
  // @IsBoolean()
  // transactionStatus?: boolean;

  @IsOptional()
  @IsNumber()
  voucherValueLocal?: number;

  @IsOptional()
  @IsNumber()
  voucherValue?: number; // in EUR
}
