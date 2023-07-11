import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChartsDTO, CountryInfo } from './dto/chart.dto';
import {
  getActiveBeneficiariesPerCountryQueryBuilder,
  getNumberOfActivePayersPerCountryQueryBuilder,
  getNumberOfRegisteredBeneficiariesPerCountryQueryBuilder,
  getNumberOfRegisteredPayersPerCountryQueryBuilder,
} from './querybuilders/charts.qb';

@Injectable()
export class ChartsService {
  constructor(private dataSource: DataSource) {}

  async findChartsInfo(take: number): Promise<ChartsDTO> {
    const activeBeneficiariesPerCountry: CountryInfo[] = await (
      await getActiveBeneficiariesPerCountryQueryBuilder(this.dataSource)
    )
      .limit(take)
      .getRawMany();
    const activePayersPerCountry: CountryInfo[] = await (
      await getNumberOfActivePayersPerCountryQueryBuilder(this.dataSource)
    )
      .limit(take)
      .getRawMany();
    const registeredBeneficiariesPerCountry: CountryInfo[] = await (
      await getNumberOfRegisteredBeneficiariesPerCountryQueryBuilder(
        this.dataSource,
      )
    )
      .limit(take)
      .getRawMany();
    const registeredPayersPerCountry: CountryInfo[] = await (
      await getNumberOfRegisteredPayersPerCountryQueryBuilder(this.dataSource)
    )
      .limit(take)
      .getRawMany();

    return {
      activeBeneficiariesPerCountry,
      activePayersPerCountry,
      registeredBeneficiariesPerCountry,
      registeredPayersPerCountry,
    } as ChartsDTO;
  }
}
