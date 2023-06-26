import {IsNotEmpty, IsNumber} from 'class-validator';

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