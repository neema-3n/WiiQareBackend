import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType, VoucherStatus } from 'src/common/constants/enums';
import { Payer } from 'src/modules/payer-svc/entities/payer.entity';
import { Patient } from 'src/modules/patient-svc/entities/patient.entity';
import { User } from 'src/modules/session/entities/user.entity';
import { Transaction } from 'src/modules/smart-contract/entities/transaction.entity';
import { Repository } from 'typeorm';
import {
  PaymentsPayerListDto,
  PaymentsProviderListDto,
  PaymentSummaryDto,
} from './dto/payment.dto';

import lookup from 'country-code-lookup';
import { subMonths, subWeeks } from 'date-fns';
import { Provider } from 'src/modules/provider-svc/entities/provider.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payer)
    private payerRepository: Repository<Payer>,

    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * This method is used to get global summary of payments
   * @returns
   */
  async getSummary(): Promise<PaymentSummaryDto> {
    // total number of payer payments received within one week
    const payerPaymentsInOneWeek = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere('transaction.createdAt >= :datePrior', {
        datePrior: subWeeks(Date.now(), 1),
      })
      .getRawOne();
    // total number of payer payments received within one month
    const payerPaymentsInOneMonth = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere('transaction.createdAt >= :datePrior', {
        datePrior: subMonths(Date.now(), 1),
      })
      .getRawOne();
    // total number of payer payments received within three month
    const payerPaymentsInThreeMonth = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere('transaction.createdAt >= :datePrior', {
        datePrior: subMonths(Date.now(), 3),
      })
      .getRawOne();
    // total number of payer payments received within six months
    const payerPaymentsInSixMonth = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere('transaction.createdAt >= :datePrior', {
        datePrior: subMonths(Date.now(), 6),
      })
      .getRawOne();
    // total number of payer payments max
    const payerPaymentsMax = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .getRawOne();
    // total claimed vouchers
    const payerClaimedVouchers = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere(
        "transaction.ownerType = 'PROVIDER' AND transaction.status = 'UNCLAIMED'",
      )
      .getRawOne();

    // total provider payments
    const payerProviderPayments = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere(
        "transaction.ownerType = 'PROVIDER' AND transaction.status = 'CLAIMED'",
      )
      .getRawOne();

    // total revenue = total value of redeemed vouchers MINUS payments made to providers
    const redeemedVouchers = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere("transaction.status = 'CLAIMED'")
      .getRawOne();

    const totalRevenue =
      redeemedVouchers.value || 0 - payerProviderPayments.value || 0;

    return {
      payerPaymentsInOneWeek: {
        numberOfPayments: payerPaymentsInOneWeek.number,
        value: payerPaymentsInOneWeek.value || 0,
      },
      payerPaymentsInOneMonth: {
        numberOfPayments: payerPaymentsInOneMonth.number,
        value: payerPaymentsInOneMonth.value || 0,
      },
      payerPaymentsInThreeMonths: {
        numberOfPayments: payerPaymentsInThreeMonth.number,
        value: payerPaymentsInThreeMonth.value || 0,
      },
      payerPaymentsInSixMonths: {
        numberOfPayments: payerPaymentsInSixMonth.number,
        value: payerPaymentsInSixMonth.value || 0,
      },
      payerPaymentsMax: {
        numberOfPayments: payerPaymentsMax.number,
        value: payerPaymentsMax.value || 0,
      },
      claimedVouchers: {
        numberOfPayments: payerClaimedVouchers.number,
        value: payerClaimedVouchers.value || 0,
      },
      providerPayments: {
        numberOfPayments: payerProviderPayments.number,
        value: payerProviderPayments.value || 0,
      },
      totalRevenue,
    } as PaymentSummaryDto;
  }

  /**
   * This method is used to retrieve list of payments received from payer
   * @returns
   */
  async getPaymentsFromPayer(): Promise<PaymentsPayerListDto[]> {
    const paymentsFromPayers = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndMapOne(
        'transaction.sender',
        Payer,
        'payer',
        'payer.user = transaction.senderId',
      )
      .leftJoinAndMapOne(
        'transaction.voucher',
        Patient,
        'patient',
        "patient.id = uuid((transaction.voucher)->>'patientId')",
      )
      .select([
        'transaction.id',
        'transaction.createdAt',
        'transaction.senderAmount',
        'payer.country',
        'patient.country',
      ])
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .getRawMany();

    return paymentsFromPayers.map((payment) => {
      const _country_payer = lookup.byFips(payment.payer_country);
      const _country_beneficiary = lookup.byFips(payment.patient_country);
      return {
        transactionId: payment.transaction_id,
        transactionDate: new Date(
          payment.transaction_created_at,
        ).toLocaleDateString(),
        paymentValue: payment.transaction_sender_amount,
        countryPayer: _country_payer != null ? _country_payer.country : '',
        countryBeneficiary:
          _country_beneficiary != null ? _country_beneficiary.country : '',
      };
    }) as PaymentsPayerListDto[];
    //return paymentsFromPayers as PaymentsPayerListDto[];
  }

  /**
   * This method is used to retrieve list of payments due to provider.
   * @returns
   */
  async getPaymentsDueProvider(): Promise<PaymentsProviderListDto[]> {
    const paymentsDueProvider = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndMapOne(
        'transaction.owner',
        Provider,
        'provider',
        'provider.id = transaction.ownerId',
      )
      .select([
        'transaction.id',
        'transaction.updatedAt',
        'provider.name',
        'provider.id',
        'provider.city',
        //'transaction.status',
        'transaction.amount',
        'transaction.senderAmount',
      ])
      .addSelect("provider.contact_person->>'country'", 'provider_country')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere(
        "transaction.ownerType = 'PROVIDER' AND transaction.status = 'UNCLAIMED'",
      )
      .getRawMany();

    return paymentsDueProvider.map((payment) => {
      const _country_provider = lookup.byFips(payment.provider_country);
      return {
        transactionId: payment.transaction_id,
        transactionDate: new Date(
          payment.transaction_updated_at,
        ).toLocaleDateString(),
        providerName: payment.provider_name,
        providerId: payment.provider_id,
        cityProvider: payment.provider_city,
        providerCountry:
          _country_provider != null ? _country_provider.country : '',
        //transactionStatus: payment.transaction_status === 'CLAIMED',
        voucherValueLocal: payment.transaction_amount,
        voucherValue: payment.transaction_sender_amount,
      };
    }) as PaymentsProviderListDto[];
    //return paymentsDueProvider as PaymentsProviderListDto[];
  }
}
