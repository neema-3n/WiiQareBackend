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
    const totalPayerPaymentsInOneWeek = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.createdAt >= :datePrior', {
        datePrior: subWeeks(Date.now(), 1),
      })
      .getCount();
    // total number of payer payments received within one month
    const totalPayerPaymentsInOneMonth = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.createdAt >= :datePrior', {
        datePrior: subMonths(Date.now(), 1),
      })
      .getCount();
    // total number of payer payments received within three month
    const totalPayerPaymentsInThreeMonths = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.createdAt >= :datePrior', {
        datePrior: subMonths(Date.now(), 3),
      })
      .getCount();
    // total number of payer payments received within six months
    const totalPayerPaymentsInSixMonths = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.createdAt >= :datePrior', {
        datePrior: subMonths(Date.now(), 6),
      })
      .getCount();
    // total number of payer payments max
    const totalPayerPaymentsMax = await this.transactionRepository.count();
    // total claimed vouchers
    const claimedVouchers = await this.transactionRepository.findAndCount({
      where: {
        ownerType: UserType.PROVIDER,
        status: VoucherStatus.UNCLAIMED,
      },
    });
    const totalClaimedVouchers = claimedVouchers[1];
    // total provider payments
    const providerPayment = await this.transactionRepository.findAndCount({
      where: {
        ownerType: UserType.PROVIDER,
        status: VoucherStatus.CLAIMED,
      },
    });
    const totalProviderPayments = providerPayment[1];
    // total revenue = total value of redeemed vouchers MINUS payments made to providers
    const redeemedVouchers = await this.transactionRepository.findAndCount({
      where: {
        status: VoucherStatus.CLAIMED,
      },
    });
    const totalRevenue = redeemedVouchers[1] - totalProviderPayments;

    return {
      totalPayerPaymentsInOneWeek,
      totalPayerPaymentsInOneMonth,
      totalPayerPaymentsInThreeMonths,
      totalPayerPaymentsInSixMonths,
      totalPayerPaymentsMax,
      totalClaimedVouchers,
      totalProviderPayments,
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
        'transaction.amount',
        'payer.country',
        'patient.country',
      ])
      .getRawMany();

    return paymentsFromPayers.map((payment) => {
      const _country_payer = lookup.byFips(payment.payer_country);
      const _country_beneficiary = lookup.byFips(payment.patient_country);
      return {
        transactionId: payment.transaction_id,
        transactionDate: new Date(
          payment.transaction_created_at,
        ).toLocaleDateString(),
        paymentValue: payment.transaction_amount,
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
        'transaction.status',
        'transaction.amount',
        'transaction.senderAmount',
      ])
      .addSelect("provider.contact_person->>'country'", 'provider_country')
      .where("transaction.ownerType = 'PROVIDER'")
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
        transactionStatus: payment.transaction_status === 'CLAIMED',
        voucherValueLocal: payment.transaction_amount,
        voucherValue: payment.transaction_sender_amount,
      };
    }) as PaymentsProviderListDto[];
    //return paymentsDueProvider as PaymentsProviderListDto[];
  }
}
