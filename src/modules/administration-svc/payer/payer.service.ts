import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType, VoucherStatus } from 'src/common/constants/enums';
import { Payer } from 'src/modules/payer-svc/entities/payer.entity';
import { User } from 'src/modules/session/entities/user.entity';
import { Transaction } from 'src/modules/smart-contract/entities/transaction.entity';
import { Repository } from 'typeorm';
import { PayerListDto, PayerSummaryDto } from './dto/payers.dto';

import lookup from 'country-code-lookup';
import { subMonths } from 'date-fns';

@Injectable()
export class PayerService {
  constructor(
    @InjectRepository(Payer)
    private PayerRepository: Repository<Payer>,

    @InjectRepository(Transaction)
    private TransactionRepository: Repository<Transaction>,

    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}
  /**
   * This method is used to get global summary of payers related vouchers information
   * @returns
   */
  async getSummary(): Promise<PayerSummaryDto> {
    // total number of registered payers
    const numberOfRegisteredPayers = await this.PayerRepository.count();

    //number of purchased vouchers
    const totalNumberOfPurchasedVouchers =
      await this.TransactionRepository.count();

    //total number of pending vouchers
    const result = await this.TransactionRepository.findAndCount({
      where: {
        ownerType: UserType.PATIENT,
        status: VoucherStatus.UNCLAIMED,
      },
    });
    const totalNumberOfPendingVouchers = result[1];

    // total Number of redeemed vouchers
    const totalNumberOfRedeemedVouchers =
      await this.TransactionRepository.count({
        where: {
          status: VoucherStatus.CLAIMED,
        },
      });

    // Total number of Active Payers

    const numberOfActivePayers = await this.PayerRepository.createQueryBuilder(
      'payer',
    )
      .leftJoinAndMapMany(
        'payer.user',
        Transaction,
        'transaction',
        'transaction.senderId = payer.user',
      )
      .where('transaction.createdAt >= :datePrior', {
        datePrior: subMonths(Date.now(), 6),
      })
      .getCount();

    return {
      numberOfRegisteredPayers,
      totalNumberOfPurchasedVouchers,
      totalNumberOfPendingVouchers,
      totalNumberOfRedeemedVouchers,
      numberOfActivePayers,
    } as PayerSummaryDto;
  }

  /**
   * This method is used to get all recap of all payers like name, country, all beneficiaries of every payer, etc
   * @returns
   */
  async findAllPayers(): Promise<PayerListDto[]> {
    const _lastActivityOn: any = await this.PayerRepository.createQueryBuilder(
      'payer',
    )
      .leftJoinAndMapMany(
        'payer.user',
        Transaction,
        'transaction',
        'transaction.senderId = payer.user',
      )
      .leftJoinAndMapMany(
        'patient.user',
        Transaction,
        'transaction',
        'transaction.ownerId = patient.user',
      )
      .select('payer.id', 'id')
      .addSelect('transaction.createAt', 'lastActivityOnTransaction')
      .addSelect('patient.updatedAt', 'lastActivityOnPatient')
      .groupBy('payer.id')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .orderBy('lastActivityOnTransaction', 'DESC')
      .addOrderBy('lastActivityOnPatient', 'DESC')
      .getRawMany();

    return _lastActivityOn;

    // First request and get id, name,
    const payerBeneficiaries: any =
      await this.PayerRepository.createQueryBuilder('payer')
        .leftJoinAndMapMany(
          'payer.user',
          Transaction,
          'transaction',
          'transaction.senderId = payer.user',
        )
        .groupBy('payer.id')
        .select('payer.id', 'id')
        .addSelect('COUNT(*)::integer', 'number')
        .addSelect('SUM(transaction.senderAmount)', 'value')
        .addSelect('payer.lastName', 'lastName')
        .addSelect('payer.firstName', 'firstName')
        .addSelect('payer.country', 'countryISO2')
        .addSelect('payer.createdAt', 'createdAt')
        .addSelect(
          "COUNT(DISTINCT(voucher->>'patientId'))",
          'totalBeneficiaries',
        )
        .where("transaction.senderCurrency IN ('eur','EUR')")
        .getRawMany();

    const _pendingVouchers: any = await this.PayerRepository.createQueryBuilder(
      'payer',
    )
      .leftJoinAndMapMany(
        'payer.user',
        Transaction,
        'transaction',
        'transaction.senderId = payer.user',
      )
      .select('payer.id', 'id')
      .addSelect('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .groupBy('payer.id')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere(
        "(transaction.ownerType = 'PATIENT' AND transaction.status = 'PENDING')",
      )
      .getRawMany();

    const _unclaimedVouchers: any =
      await this.PayerRepository.createQueryBuilder('payer')
        .leftJoinAndMapMany(
          'payer.user',
          Transaction,
          'transaction',
          'transaction.senderId = payer.user',
        )
        .select('payer.id', 'id')
        .addSelect('COUNT(*)::integer', 'number')
        .addSelect('SUM(transaction.senderAmount)', 'value')
        .groupBy('payer.id')
        .where("transaction.senderCurrency IN ('eur','EUR')")
        .where(
          "(transaction.ownerType = 'PROVIDER' AND transaction.status = 'UNCLAIMED')",
        )
        .getRawMany();

    const _redeemedVouchers: any =
      await this.PayerRepository.createQueryBuilder('payer')
        .leftJoinAndMapMany(
          'payer.user',
          Transaction,
          'transaction',
          'transaction.senderId = payer.user',
        )
        .select('payer.id', 'id')
        .addSelect('COUNT(*)::integer', 'number')
        .addSelect('SUM(transaction.senderAmount)', 'value')
        .groupBy('payer.id')
        .addSelect('COUNT(*)', 'totalRedeemedVouchers')
        .where("transaction.senderCurrency IN ('eur','EUR')")
        .andWhere("transaction.status = 'BURNED'")
        .getRawMany();

    const payers = [];
    for (let _i = 0; _i < payerBeneficiaries.length; _i++) {
      const _country = lookup.byFips(payerBeneficiaries[_i].countryISO2);
      payers.push({
        payerId: payerBeneficiaries[_i].id,
        payerName:
          payerBeneficiaries[_i].firstName +
          ' ' +
          payerBeneficiaries[_i].lastName,
        registeredDate: new Date(
          payerBeneficiaries[_i].createdAt,
        ).toLocaleDateString(),
        payerCountry: _country != null ? _country.country : '',
        beneficiaries: payerBeneficiaries[_i].totalBeneficiaries,
        purchasedVouchers: {
          numberOfVouchers: payerBeneficiaries[_i].number,
          value: payerBeneficiaries[_i].value || 0,
        },
        pendingVouchers: this.getVoucherInfoTotal(
          _pendingVouchers,
          payerBeneficiaries[_i].id,
        ),
        unclaimedVouchers: this.getVoucherInfoTotal(
          _unclaimedVouchers,
          payerBeneficiaries[_i].id,
        ),
        redeemedVouchers: this.getVoucherInfoTotal(
          _redeemedVouchers,
          payerBeneficiaries[_i].id,
        ),
      });
    }
    return payers as PayerListDto[];
  }

  private getVoucherInfoTotal(voucherType: [], _id: string): any {
    for (const _v of voucherType) {
      if (_v['id'] === _id)
        return {
          numberOfVouchers: _v['number'],
          value: _v['value'] || 0,
        };
    }
    return {
      numberOfVouchers: 0,
      value: 0,
    };
  }
}
