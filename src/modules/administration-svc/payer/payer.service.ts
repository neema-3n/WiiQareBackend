import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoucherStatus } from 'src/common/constants/enums';
import { Payer } from 'src/modules/payer-svc/entities/payer.entity';
import { User } from 'src/modules/session/entities/user.entity';
import { Transaction } from 'src/modules/smart-contract/entities/transaction.entity';
import { Repository } from 'typeorm';
import { PayerListDto } from './dto/payers.dto';

import lookup from 'country-code-lookup';

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
  async getSummary() {
    const numberOfRegisteredPayers = await this.PayerRepository.count();

    const totalNumberOfPurchasedVouchers =
      await this.TransactionRepository.count();

    const totalNumberOfPendingVouchers =
      await this.TransactionRepository.createQueryBuilder('transaction')
        .where(
          "(transaction.ownerType = 'PATIENT' AND transaction.status = 'UNCLAIMED')",
        )
        .getCount();

    const totalNumberOfRedeemedVouchers =
      await this.TransactionRepository.count({
        where: {
          status: VoucherStatus.CLAIMED,
        },
      });

    // TODO : use date-fns to get active payers dates from the last 6months
    const numberOfActivePayers = 0;

    return {
      numberOfRegisteredPayers,
      totalNumberOfPurchasedVouchers,
      totalNumberOfPendingVouchers,
      totalNumberOfRedeemedVouchers,
      numberOfActivePayers,
    };
  }

  //TODO :  \payers\id
  findPayer(id) {
    return `Payer with id : ${id}`;
  }

  /**
   * This method is used to get all recap of all payers like name, country, all beneficiaries of every payer, etc
   * @returns
   */
  async findAllPayers(): Promise<PayerListDto[]> {
    // First request and get id, name,
    const payerTotalBeneficiaries: any =
      await this.PayerRepository.createQueryBuilder('payer')
        .leftJoinAndMapMany(
          'payer.user',
          Transaction,
          'transaction',
          'transaction.senderId = payer.user',
        )
        .groupBy('payer.id')
        .select('payer.id', 'id')
        .addSelect('payer.lastName', 'lastName')
        .addSelect('payer.country', 'countryISO2')
        .addSelect('payer.createdAt', 'createdAt')
        .addSelect(
          "COUNT(DISTINCT(voucher->>'patientId'))",
          'totalBeneficiaries',
        )
        .addSelect('COUNT(*)', 'totalPurchasedVouchers')
        .getRawMany();

    const payerTotalPendingVouchers: any =
      await this.PayerRepository.createQueryBuilder('payer')
        .leftJoinAndMapMany(
          'payer.user',
          Transaction,
          'transaction',
          'transaction.senderId = payer.user',
        )
        .select('payer.id', 'id')
        .groupBy('payer.id')
        .addSelect('COUNT(*)', 'totalPendingVouchers')
        .where(
          "(transaction.ownerType = 'PATIENT' AND transaction.status = 'UNCLAIMED')",
        )
        .getRawMany();

    const payerTotalUnclaimedVouchers: any =
      await this.PayerRepository.createQueryBuilder('payer')
        .leftJoinAndMapMany(
          'payer.user',
          Transaction,
          'transaction',
          'transaction.senderId = payer.user',
        )
        .select('payer.id', 'id')
        .groupBy('payer.id')
        .addSelect('COUNT(*)', 'totalUnclaimedVouchers')
        .where(
          "(transaction.ownerType = 'PROVIDER' AND transaction.status = 'UNCLAIMED')",
        )
        .getRawMany();

    const payerTotalRedeemedVouchers: any =
      await this.PayerRepository.createQueryBuilder('payer')
        .leftJoinAndMapMany(
          'payer.user',
          Transaction,
          'transaction',
          'transaction.senderId = payer.user',
        )
        .select('payer.id', 'id')
        .groupBy('payer.id')
        .addSelect('COUNT(*)', 'totalRedeemedVouchers')
        .where("transaction.status = 'CLAIMED'")
        // .where(
        //   "(transaction.ownerType = 'PROVIDER' AND transaction.status = 'PENDING')",
        // )
        .getRawMany();

    const payers = [];
    for (let _i = 0; _i < payerTotalBeneficiaries.length; _i++) {
      const _country = lookup.byFips(payerTotalBeneficiaries[_i].countryISO2);
      payers.push({
        payerId: payerTotalBeneficiaries[_i].id,
        payerName: payerTotalBeneficiaries[_i].lastName,
        registeredDate: new Date(
          payerTotalBeneficiaries[_i].createdAt,
        ).toLocaleDateString(),
        payerCountry: _country != null ? _country.country : '',
        beneficiaries: payerTotalBeneficiaries[_i].totalBeneficiaries,
        purchasedVouchers: payerTotalBeneficiaries[_i].totalPurchasedVouchers,
        pendingVouchers: this.getTotal(
          payerTotalPendingVouchers,
          payerTotalBeneficiaries[_i].id,
          'totalPendingVouchers',
        ),
        unclaimedVouchers: this.getTotal(
          payerTotalUnclaimedVouchers,
          payerTotalBeneficiaries[_i].id,
          'totalUnclaimedVouchers',
        ),
        redeemedVouchers: this.getTotal(
          payerTotalRedeemedVouchers,
          payerTotalBeneficiaries[_i].id,
          'totalRedeemedVouchers',
        ),
      });
    }
    return payers as PayerListDto[];
  }

  private getTotal(totalObjet: [], _id: string, _key: string): number {
    for (const total of totalObjet) {
      if (total['id'] === _id) return total[_key];
    }
    return 0;
  }
}
