import { IsNumber } from 'class-validator';

export class VoucherTotalsInfo {
  @IsNumber()
  numberOfVouchers: number;
  @IsNumber()
  value: number;
}
