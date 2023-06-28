import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoucherStatus } from 'src/common/constants/enums';
import { Payer } from 'src/modules/payer-svc/entities/payer.entity';
import { User } from 'src/modules/session/entities/user.entity';
import { Transaction } from 'src/modules/smart-contract/entities/transaction.entity';
import { Repository } from 'typeorm';
import { PayerListDto } from './dto/payers.dto';

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

    const totalNumberOfPendingVouchers = await this.TransactionRepository.count(
      {
        where: {
          status: VoucherStatus.PENDING,
        },
      },
    );

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

  //TODO  \payers
  async findAllPayers(): Promise<PayerListDto[]> {
    const payerTotalBeneficiaries: any =
      await this.TransactionRepository.createQueryBuilder('transaction')
        .leftJoinAndMapMany(
          'transaction.sender',
          Payer,
          'payer',
          'payer.user = transaction.senderId',
        )
        .groupBy('payer.id')
        .select('payer.id', 'id')
        .addSelect('payer.lastName', 'lastName')
        .addSelect('payer.createdAt', 'createdAt')
        .addSelect('COUNT(*)', 'totalBeneficiaries')
        .addSelect('SUM(transaction.amount)', 'totalPurchasedVouchers')
        .getRawMany();

    const payerTotalUnspentVouchers: any =
      await this.TransactionRepository.createQueryBuilder('transaction')
        .leftJoinAndMapMany(
          'transaction.sender',
          Payer,
          'payer',
          'payer.user = transaction.senderId',
        )
        .select('payer.id', 'id')
        .groupBy('payer.id')
        .addSelect('SUM(transaction.amount)', 'totalUnspentVouchers')
        .where("transaction.ownerType = 'PATIENT'")
        .getRawMany();

    const payerTotalOpenVouchers: any =
      await this.TransactionRepository.createQueryBuilder('transaction')
        .leftJoinAndMapMany(
          'transaction.sender',
          Payer,
          'payer',
          'payer.user = transaction.senderId',
        )
        .select('payer.id', 'id')
        .groupBy('payer.id')
        .addSelect('SUM(transaction.amount)', 'totalOpenVouchers')
        .where(
          "(transaction.ownerType = 'PROVIDER' AND transaction.status = 'UNCLAIMED')",
        )
        .getRawMany();

    const payerTotalRedeemedVouchers: any =
      await this.TransactionRepository.createQueryBuilder('transaction')
        .leftJoinAndMapMany(
          'transaction.sender',
          Payer,
          'payer',
          'payer.user = transaction.senderId',
        )
        .select('payer.id', 'id')
        .groupBy('payer.id')
        .addSelect('SUM(transaction.amount)', 'totalRedeemedVouchers')
        .where(
          "(transaction.ownerType = 'PROVIDER' AND transaction.status = 'PENDING')",
        )
        .getRawMany();

    const payers = [];
    for (let _i = 0; _i < payerTotalBeneficiaries.length; _i++) {
      payers.push({
        payerId: payerTotalBeneficiaries[_i].id,
        payerName: payerTotalBeneficiaries[_i].lastName,
        registredDate: payerTotalBeneficiaries[_i].createdAt,
        totalBeneficiaries: payerTotalBeneficiaries[_i].totalBeneficiaries,
        totalPurchasedVouchers:
          payerTotalBeneficiaries[_i].totalPurchasedVouchers,
        totalUnspentVouchers: this.getTotal(
          payerTotalUnspentVouchers,
          payerTotalBeneficiaries[_i].id,
          'totalUnspentVouchers',
        ),
        totalOpenVouchers: this.getTotal(
          payerTotalOpenVouchers,
          payerTotalBeneficiaries[_i].id,
          'totalOpenVouchers',
        ),
        totalRedeemedVouchers: this.getTotal(
          payerTotalRedeemedVouchers,
          payerTotalBeneficiaries[_i].id,
          'totalRedeemedVouchers',
        ),
      });
    }
    return payers as PayerListDto[];

    /*
    return payerTotalBeneficiaries.map((payer) => {
      return {
        'payerId': payer.id,
        'payerName': payer.lastName,
        'registredDate': payer.createdAt,
        'totalBeneficiaries': payer.totalBeneficiaries,
        'totalPurchasedVouchers': payer.totalPurchasedVouchers
      }
    }) as PayerListDto[];
    */
  }

  getTotal(totalObjet: [], id: string, _key: string): number {
    for (const total of totalObjet) {
      if (total['id'] === id) return total[_key];
    }
    return 0;
  }
}
