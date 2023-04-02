import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class MintVoucherDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsIn(['USD', 'EURO'])
  currency: 'USD' | 'EURO';

  @IsNotEmpty()
  @IsUUID(4)
  ownerId: string;

  @IsNotEmpty()
  @IsUUID(4)
  patientId: string;

  @IsOptional()
  description: Record<string, any>;
}

export class TransferVoucherDto {
  @IsNotEmpty()
  @IsString()
  voucherId: string;

  @IsNotEmpty()
  // @IsUUID(4)
  @IsString()
  ownerId: string;
}
