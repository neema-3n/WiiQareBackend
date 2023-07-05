import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  IsDate,
  IsBoolean,
} from 'class-validator';

export class PaymentSummaryDto {
  @IsNotEmpty()
  @IsNumber()
  totalPayerPaymentsInOneWeek: number;

  @IsNotEmpty()
  @IsNumber()
  totalPayerPaymentsInOneMonth: number;

  @IsNotEmpty()
  @IsNumber()
  totalPayerPaymentsInThreeMonths: number;

  @IsNotEmpty()
  @IsNumber()
  totalPayerPaymentsInSixMonths: number;

  @IsNotEmpty()
  @IsNumber()
  totalPayerPaymentsMax: number;

  @IsNotEmpty()
  @IsNumber()
  totalClaimedVouchers: number;

  @IsNotEmpty()
  @IsNumber()
  totalProviderPayments: number;

  @IsNotEmpty()
  @IsNumber()
  totalRevenue: number;
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

  @IsOptional()
  @IsBoolean()
  transactionStatus?: boolean;

  @IsOptional()
  @IsNumber()
  voucherValueLocal?: number;

  @IsOptional()
  @IsNumber()
  voucherValue?: number; // in EUR
}
