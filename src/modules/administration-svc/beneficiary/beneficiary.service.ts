import { Injectable } from '@nestjs/common';
import {
  convertToCurrency,
  getCountryNameFromCode,
} from 'src/helpers/common.helper';

import { DataSource } from 'typeorm';
import { BeneficiaryDTO } from './dto/beneficiary.dto';
import { getAllBeneficiariesQueryBuilder } from './querybuilders/getAllbeneficiary.qb';
import {
  getActiveBeneficiariesQueryBuilder,
  getBeneficiaryToProviderTransactionsQueryBuilder,
  getNumberOfRegisteredBeneficiariesQueryBuilder,
  getPendingVouchersForAllBeneficiariesQueryBuilder,
  getRedeemedVouchersForAllBeneficiariesQueryBuilder,
} from './querybuilders/getSummary.qb';

@Injectable()
export class BeneficiaryService {
  constructor(private dataSource: DataSource) {}

  async findAllBeneficiaries(): Promise<Array<BeneficiaryDTO>> {
    const beneficiariesRawData = await (
      await getAllBeneficiariesQueryBuilder(this.dataSource)
    ).getRawMany();

    const beneficiaries: Array<BeneficiaryDTO> = [];

    for (const {
      id,
      name,
      country,
      registrationDate,
      totalNumberOfDistinctPayers,
      totalNumberOfDistinctProviders,
      currency,
      totalPayment,
      totalPaymentCount,
      numberOfActiveVouchers,
      totalAmountOfActiveVouchers,
      numberOfPendingVouchers,
      totalAmountOfPendingVouchers,
      numberOfUnclaimedVouchers,
      totalAmountOfUnclaimedVouchers,
      numberOfRedeemedVouchers,
      totalAmountOfRedeemedVouchers,
    } of beneficiariesRawData) {
      const beneficiary: BeneficiaryDTO = {
        id,
        name,
        country: getCountryNameFromCode(country) || '',
        registrationDate,
        lastActivityOn: '',
        totalNumberOfDistinctPayers: totalNumberOfDistinctPayers || 0,
        totalNumberOfDistinctProviders: totalNumberOfDistinctProviders || 0,
        currency: 'EUR',
        totalPayment: {
          numberOfPayments: totalPaymentCount || 0,
          value: await convertToCurrency(currency, totalPayment, 'EUR'),
        },
        activeVouchers: {
          numberOfVouchers: numberOfActiveVouchers || 0,
          value: await convertToCurrency(
            currency,
            totalAmountOfActiveVouchers,
            'EUR',
          ),
        },
        pendingVouchers: {
          numberOfVouchers: numberOfPendingVouchers || 0,
          value: await convertToCurrency(
            currency,
            totalAmountOfPendingVouchers,
            'EUR',
          ),
        },
        unclaimedVouchers: {
          numberOfVouchers: numberOfUnclaimedVouchers || 0,
          value: await convertToCurrency(
            currency,
            totalAmountOfUnclaimedVouchers,
            'EUR',
          ),
        },
        redeemedVouchers: {
          numberOfVouchers: numberOfRedeemedVouchers || 0,
          value: await convertToCurrency(
            currency,
            totalAmountOfRedeemedVouchers,
            'EUR',
          ),
        },
      };
      beneficiaries.push(beneficiary);
    }

    return beneficiaries;
  }

  async getSummary() {
    const result1 = await (
      await getNumberOfRegisteredBeneficiariesQueryBuilder(this.dataSource)
    ).getRawOne();

    const result2 = await (
      await getPendingVouchersForAllBeneficiariesQueryBuilder(this.dataSource)
    ).getRawMany();

    const result3 = await (
      await getRedeemedVouchersForAllBeneficiariesQueryBuilder(this.dataSource)
    ).getRawMany();
    const result4 = await (
      await getBeneficiaryToProviderTransactionsQueryBuilder(this.dataSource)
    ).getRawMany();
    const result5 = await (
      await getActiveBeneficiariesQueryBuilder(this.dataSource)
    ).getRawOne();
    return { result1, result2, result3, result4, result5 };
  }
}
