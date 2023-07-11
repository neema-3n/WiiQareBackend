import { IsNumber } from 'class-validator';

export class VoucherTotalsInfo {
  @IsNumber()
  numberOfVouchers: number;
  @IsNumber()
  value: number;
}

export class PaymentTotalsInfo {
  @IsNumber()
  numberOfPayments: number;
  @IsNumber()
  value: number;
}
