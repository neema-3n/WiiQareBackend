import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber
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
    @IsNumber()
    totalBeneficiaries?: number;
  
    @IsOptional()
    @IsNumber()
    totalPurchasedVouchers?: number;

    @IsOptional()
    @IsNumber()
    totalUnspentVouchers?: number;

    @IsOptional()
    @IsNumber()
    totalOpenVouchers?: number;

    @IsOptional()
    @IsNumber()
    totalRedeemedVouchers?: number;
  }