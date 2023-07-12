import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChartsDTO, CountryInfo } from './dto/chart.dto';
import {
  getActiveBeneficiariesPerCountryQueryBuilder,
  getNumberOfActivePayersPerCountryQueryBuilder,
  getNumberOfRegisteredBeneficiariesPerCountryQueryBuilder,
  getNumberOfRegisteredPayersPerCountryQueryBuilder,
} from './querybuilders/charts.qb';
import { getCountryNameFromCode } from '../_common_';

@Injectable()
export class ChartsService {
  constructor(private dataSource: DataSource) {}

  /**
   * Method used to retrieve list of active beneficiaries and payers per country,total number of registered beneficiaries and payers per country, and sorts them in descending order
   * @param take number of records
   * @returns
   */
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
      activeBeneficiariesPerCountry: this.transformCountryNameInArray(
        activeBeneficiariesPerCountry,
      ),
      activePayersPerCountry: this.transformCountryNameInArray(
        activePayersPerCountry,
      ),
      registeredBeneficiariesPerCountry: this.transformCountryNameInArray(
        registeredBeneficiariesPerCountry,
      ),
      registeredPayersPerCountry: this.transformCountryNameInArray(
        registeredPayersPerCountry,
      ),
    } as ChartsDTO;
  }

  /**
   * Transforms country code to its country name in an array
   * @param arrWithCountryCodes Array of countryInfo
   * @type CountryInfo {country:string,count:number}
   * @returns Array with transform country names
   */
  private transformCountryNameInArray(arrWithCountryCodes: Array<CountryInfo>) {
    const listWithCountryName: Array<CountryInfo> = [];
    for (const { count, country } of arrWithCountryCodes) {
      listWithCountryName.push({
        country: getCountryNameFromCode(country),
        count,
      });
    }
    return listWithCountryName;
  }
}
