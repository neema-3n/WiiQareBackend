import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  convertToCurrency,
  getCountryNameFromCode,
} from 'src/helpers/common.helper';
import { Patient } from 'src/modules/patient-svc/entities/patient.entity';
import { Payer } from 'src/modules/payer-svc/entities/payer.entity';
import { Provider } from 'src/modules/provider-svc/entities/provider.entity';
import { Transaction } from 'src/modules/smart-contract/entities/transaction.entity';
import {
  DataSource,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BeneficiaryDTO } from './dto/beneficiary.dto';

@Injectable()
export class BeneficiaryService {
  constructor(
    @InjectRepository(Patient)
    private PatientRepository: Repository<Patient>,

    @InjectRepository(Transaction)
    private TransactionRepository: Repository<Transaction>,

    @InjectRepository(Provider)
    private ProviderRepository: Repository<Provider>,

    private dataSource: DataSource,
  ) {}

  getSummary() {
    return;
  }

  /**
   * QueryBuilder used to get patients Id,full Name, country code and registration date
   */
  private async getPatientInfoQueryBuilder(): Promise<
    SelectQueryBuilder<Patient>
  > {
    return await this.dataSource
      .createQueryBuilder()
      .from(Patient, 'patient')
      .addSelect('patient.id::text', 'patientId')
      .addSelect("concat_ws(' ',patient.first_name, patient.last_name)", 'name')
      .addSelect('patient.country', 'country')
      .addSelect(
        "to_char(patient.created_at,'dd/mm/yyyy')",
        'registrationDate',
      );
  }

  private async getUniqueProviderCountPerPatientQueryBuilder(): Promise<
    SelectQueryBuilder<Transaction>
  > {
    return await this.dataSource
      .createQueryBuilder()
      .from(Transaction, 'transaction')
      .addSelect("transaction.voucher->>'patientId'", 'patientId')
      .addSelect(
        'COUNT(DISTINCT provider.id)',
        'totalNumberOfDistinctProviders',
      )
      .leftJoin(Provider, 'provider', 'transaction.ownerId = provider.user')
      .groupBy(`"patientId"`);
  }

  private async getUniquePayerCountPerPatientQueryBuilder(): Promise<
    SelectQueryBuilder<Transaction>
  > {
    return await this.dataSource
      .createQueryBuilder()
      .from(Transaction, 'transaction')
      .addSelect('patient.id::text', 'patientId')
      .addSelect('COUNT(DISTINCT payer.id)', 'totalNumberOfPayers')
      .leftJoin(Payer, 'payer', 'payer.user = transaction.senderId')
      .leftJoin(
        Patient,
        'patient',
        "patient.id::text = transaction.voucher->>'patientId'",
      )
      .groupBy(`"patientId"`);
  }

  private async getTotalPaymentPerPatientQueryBuilder(): Promise<
    SelectQueryBuilder<Transaction>
  > {
    return await this.dataSource
      .createQueryBuilder()
      .from(Transaction, 'transaction')
      .addSelect("transaction.voucher->>'patientId'", 'patientId')
      .addSelect('COUNT(transaction.senderAmount)', 'totalPaymentCount')
      .addSelect('SUM(transaction.senderAmount)', 'totalPayment')
      .addSelect('lower(transaction.senderCurrency)', 'senderCurrency')
      .where(
        "(transaction.status ='PENDING' AND transaction.ownerType ='PATIENT')",
      )
      .orWhere(
        "(transaction.status IN ('UNCLAIMED','CLAIMED','BURNED') AND transaction.ownerType='PROVIDER')",
      )
      .groupBy(`"patientId"`)
      .addGroupBy(`"senderCurrency"`);
  }

  private async getActiveVoucherPerPatientQueryBuilder(): Promise<
    SelectQueryBuilder<Transaction>
  > {
    return await this.dataSource
      .createQueryBuilder()
      .from(Transaction, 'transaction')
      .addSelect("transaction.voucher->>'patientId'", 'patientId')
      .addSelect('COUNT(transaction.voucher)', 'numberOfActiveVouchers')
      .addSelect('lower(transaction.senderCurrency)', 'senderCurrency')
      .addSelect('SUM(transaction.senderAmount)', 'totalAmountOfActiveVouchers')
      .where(
        "(transaction.status ='PENDING' AND transaction.ownerType ='PATIENT')",
      )
      .orWhere(
        "(transaction.status IN ('UNCLAIMED','CLAIMED') AND transaction.ownerType='PROVIDER')",
      )
      .groupBy(`"patientId"`)
      .addGroupBy(`"senderCurrency"`);
  }

  private async getPendingVoucherPerPatientQueryBuilder(): Promise<
    SelectQueryBuilder<Transaction>
  > {
    return await this.dataSource
      .createQueryBuilder()
      .from(Transaction, 'transaction')
      .addSelect("transaction.voucher->>'patientId'", 'patientId')
      .addSelect('COUNT(transaction.voucher)', 'numberOfPendingVouchers')
      .addSelect('lower(transaction.senderCurrency)', 'senderCurrency')
      .addSelect(
        'SUM(transaction.senderAmount)',
        'totalAmountOfPendingVouchers',
      )

      .where("transaction.status='PENDING'")
      .andWhere("transaction.ownerType='PATIENT'")
      .groupBy(`"patientId"`)
      .addGroupBy(`"senderCurrency"`);
  }

  private async getUnclaimedVoucherPerPatientQueryBuilder(): Promise<
    SelectQueryBuilder<Transaction>
  > {
    return await this.dataSource
      .createQueryBuilder()
      .from(Transaction, 'transaction')
      .addSelect("transaction.voucher->>'patientId'", 'patientId')
      .addSelect('COUNT(transaction.voucher)', 'numberOfUnclaimedVouchers')
      .addSelect('lower(transaction.senderCurrency)', 'senderCurrency')
      .addSelect(
        'SUM(transaction.senderAmount)',
        'totalAmountOfUnclaimedVouchers',
      )
      .where("transaction.status='UNCLAIMED'")
      .andWhere("transaction.ownerType='PROVIDER'")
      .groupBy(`"patientId"`)
      .addGroupBy(`"senderCurrency"`);
  }

  private async getRedeemedVoucherPerPatientQueryBuilder(): Promise<
    SelectQueryBuilder<Transaction>
  > {
    return await this.dataSource
      .createQueryBuilder()
      .from(Transaction, 'transaction')
      .addSelect("transaction.voucher->>'patientId'", 'patientId')
      .addSelect('COUNT(transaction.voucher)', 'numberOfRedeemedVouchers')
      .addSelect('lower(transaction.senderCurrency)', 'senderCurrency')
      .addSelect(
        'SUM(transaction.senderAmount)',
        'totalAmountOfRedeemedVouchers',
      )
      .where("transaction.status='CLAIMED'")
      .andWhere("transaction.ownerType='PROVIDER'")
      .groupBy(`"patientId"`)
      .addGroupBy(`"senderCurrency"`);
  }

  private async getAllBeneficiariesQueryBuilder(): Promise<
    SelectQueryBuilder<ObjectLiteral>
  > {
    return this.dataSource
      .createQueryBuilder()
      .addCommonTableExpression(
        await this.getPatientInfoQueryBuilder(),
        'patientTable',
      )
      .addCommonTableExpression(
        await this.getUniquePayerCountPerPatientQueryBuilder(),
        'payerCountTable',
      )
      .addCommonTableExpression(
        await this.getUniqueProviderCountPerPatientQueryBuilder(),
        'providerCountTable',
      )
      .addCommonTableExpression(
        await this.getTotalPaymentPerPatientQueryBuilder(),
        'totalPaymentTable',
      )
      .addCommonTableExpression(
        await this.getActiveVoucherPerPatientQueryBuilder(),
        'activeVoucherTable',
      )
      .addCommonTableExpression(
        await this.getPendingVoucherPerPatientQueryBuilder(),
        'pendingVoucherTable',
      )
      .addCommonTableExpression(
        await this.getUnclaimedVoucherPerPatientQueryBuilder(),
        'unclaimedVoucherTable',
      )
      .addCommonTableExpression(
        await this.getRedeemedVoucherPerPatientQueryBuilder(),
        'redeemedVoucherTable',
      )
      .from('patientTable', 'p')
      .leftJoin('payerCountTable', 'pc', `"p"."patientId"="pc"."patientId"`)
      .leftJoin(
        'providerCountTable',
        'pdc',
        `"p"."patientId"="pdc"."patientId"`,
      )
      .leftJoin('totalPaymentTable', 'tp', `"p"."patientId"="tp"."patientId"`)
      .leftJoin('activeVoucherTable', 'av', `"p"."patientId"="av"."patientId"`)
      .leftJoin('pendingVoucherTable', 'pv', `"p"."patientId"="pv"."patientId"`)
      .leftJoin(
        'unclaimedVoucherTable',
        'uv',
        `"p"."patientId"="uv"."patientId"`,
      )
      .leftJoin(
        'redeemedVoucherTable',
        'rv',
        `"p"."patientId"="rv"."patientId"`,
      )
      .addSelect(`"p"."patientId"`, 'id')
      .addSelect(`"p"."name"`, 'name')
      .addSelect(`"p"."country"`, 'country')
      .addSelect(`"p"."registrationDate"`, 'registrationDate')
      .addSelect(
        `"pc"."totalNumberOfPayers"::integer`,
        'totalNumberOfDistinctPayers',
      )
      .addSelect(
        `"pdc"."totalNumberOfDistinctProviders"::integer`,
        'totalNumberOfDistinctProviders',
      )
      .addSelect(`"tp"."senderCurrency"`, 'currency')
      .addSelect(`"tp"."totalPayment"::real`, 'totalPayment')
      .addSelect(`"tp"."totalPaymentCount"::integer`, 'totalPaymentCount')
      .addSelect(
        `"av"."numberOfActiveVouchers"::integer`,
        'numberOfActiveVouchers',
      )
      .addSelect(
        `"av"."totalAmountOfActiveVouchers"::real`,
        'totalAmountOfActiveVouchers',
      )
      .addSelect(
        `"pv"."numberOfPendingVouchers"::integer`,
        'numberOfPendingVouchers',
      )
      .addSelect(
        `"pv"."totalAmountOfPendingVouchers"::real`,
        'totalAmountOfPendingVouchers',
      )
      .addSelect(
        `"uv"."numberOfUnclaimedVouchers"::integer`,
        'numberOfUnclaimedVouchers',
      )
      .addSelect(
        `"uv"."totalAmountOfUnclaimedVouchers"::real`,
        'totalAmountOfUnclaimedVouchers',
      )
      .addSelect(
        `"rv"."numberOfRedeemedVouchers"::integer`,
        'numberOfRedeemedVouchers',
      )
      .addSelect(
        `"rv"."totalAmountOfRedeemedVouchers"::real`,
        'totalAmountOfRedeemedVouchers',
      )
      .orderBy(`"name"`);
  }

  async findAllBeneficiaries(): Promise<Array<BeneficiaryDTO>> {
    const beneficiariesRawData = await (
      await this.getAllBeneficiariesQueryBuilder()
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
}
