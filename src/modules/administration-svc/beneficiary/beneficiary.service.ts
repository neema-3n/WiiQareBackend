import { Injectable } from '@nestjs/common';
import {
  //convertToCurrency,
  getCountryNameFromCode,
} from 'src/helpers/common.helper';

import { DataSource } from 'typeorm';
import { BeneficiaryDTO, BeneficiarySummaryDTO } from './dto/beneficiary.dto';
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
      // currency,
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
          //value: await convertToCurrency(currency, totalPayment, 'EUR'),
          value: totalPayment || 0,
        },
        activeVouchers: {
          numberOfVouchers: numberOfActiveVouchers || 0,
          // value: await convertToCurrency(
          //   currency,
          //   totalAmountOfActiveVouchers,
          //   'EUR',
          // ),
          value: totalAmountOfActiveVouchers || 0,
        },
        pendingVouchers: {
          numberOfVouchers: numberOfPendingVouchers || 0,
          // value: await convertToCurrency(
          //   currency,
          //   totalAmountOfPendingVouchers,
          //   'EUR',
          // ),
          value: totalAmountOfPendingVouchers || 0,
        },
        unclaimedVouchers: {
          numberOfVouchers: numberOfUnclaimedVouchers || 0,
          // value: await convertToCurrency(
          //   currency,
          //   totalAmountOfUnclaimedVouchers,
          //   'EUR',
          // ),
          value: totalAmountOfUnclaimedVouchers || 0,
        },
        redeemedVouchers: {
          numberOfVouchers: numberOfRedeemedVouchers || 0,
          // value: await convertToCurrency(
          //   currency,
          //   totalAmountOfRedeemedVouchers,
          //   'EUR',
          // ),
          value: totalAmountOfRedeemedVouchers || 0,
        },
      };
      beneficiaries.push(beneficiary);
    }

    return beneficiaries;
  }

  async getSummary(): Promise<BeneficiarySummaryDTO> {
    const { numberOfRegisteredBeneficiaries } = await (
      await getNumberOfRegisteredBeneficiariesQueryBuilder(this.dataSource)
    ).getRawOne();

    const { numberOfPendingVouchers, totalAmountOfPendingVouchers } = await (
      await getPendingVouchersForAllBeneficiariesQueryBuilder(this.dataSource)
    ).getRawOne();

    const { numberOfRedeemedVouchers, totalAmountOfRedeemedVouchers } = await (
      await getRedeemedVouchersForAllBeneficiariesQueryBuilder(this.dataSource)
    ).getRawOne();
    const { numberOfProviderTransactions, totalAmountOfProviderTransactions } =
      await (
        await getBeneficiaryToProviderTransactionsQueryBuilder(this.dataSource)
      ).getRawOne();
    const { numberOfActiveBeneficiaries } = await (
      await getActiveBeneficiariesQueryBuilder(this.dataSource)
    ).getRawOne();

    return {
      numberOfRegisteredBeneficiaries,
      pendingVouchers: {
        numberOfVouchers: numberOfPendingVouchers,
        value: totalAmountOfPendingVouchers,
      },
      redeemedVouchers: {
        numberOfVouchers: numberOfRedeemedVouchers,
        value: totalAmountOfRedeemedVouchers,
      },
      totalProviderTransactions: {
        numberOfPayments: numberOfProviderTransactions,
        value: totalAmountOfProviderTransactions,
      },
      numberOfActiveBeneficiaries,
      voucherCurrencies: 'EUR',
    } as BeneficiarySummaryDTO;
  }
}
