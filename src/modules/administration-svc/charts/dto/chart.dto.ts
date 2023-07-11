import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class CountryInfo {
  @IsString()
  country: string;
  @IsNumber()
  count: number;
}

export class ChartsDTO {
  @ValidateNested()
  registeredPayersPerCountry: Array<CountryInfo>;
  @ValidateNested()
  activePayersPerCountry: Array<CountryInfo>;
  @ValidateNested()
  registeredBeneficiariesPerCountry: Array<CountryInfo>;
  @ValidateNested()
  activeBeneficiariesPerCountry: Array<CountryInfo>;
}
