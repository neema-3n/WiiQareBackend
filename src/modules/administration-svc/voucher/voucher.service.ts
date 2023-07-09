import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserType, VoucherStatus } from 'src/common/constants/enums';
import { Transaction } from 'src/modules/smart-contract/entities/transaction.entity';
import { Repository } from 'typeorm';
import { VoucherListDto, VoucherSummaryDto } from './dto/voucher.dto';
import { subMonths, subWeeks } from 'date-fns';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * This method is used to get global summary of vouchers
   * @returns
   */
  async getSummary(): Promise<VoucherSummaryDto> {
    // Vouchers made in one week
    const vouchersInOneWeek = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere('transaction.createdAt >= :datePrior', {
        datePrior: subWeeks(Date.now(), 1),
      })
      .getRawOne();
    // Vouchers made in one month
    const vouchersInOneMonth = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere('transaction.createdAt >= :datePrior', {
        datePrior: subMonths(Date.now(), 1),
      })
      .getRawOne();
    // Vouchers made in three months
    const vouchersInThreeMonths = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere('transaction.createdAt >= :datePrior', {
        datePrior: subMonths(Date.now(), 3),
      })
      .getRawOne();
    // Vouchers made in six months
    const vouchersInInSixMonths = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere('transaction.createdAt >= :datePrior', {
        datePrior: subMonths(Date.now(), 6),
      })
      .getRawOne();
    // Vouchers made in max time
    const vouchersInMaxTime = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .getRawOne();
    // Pending vouchers
    const pendingVouchers = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere("transaction.status = 'PENDING'")
      .andWhere(
        "transaction.ownerType = 'PATIENT' AND transaction.ownerType = 'PROVIDER'",
      )
      .getRawOne();

    // Redeemed vouchers
    const redeemedVouchers = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere(
        "transaction.ownerType = 'PROVIDER' AND transaction.status = 'CLAIMED'",
      )
      .getRawOne();

    // Unclaimed vouchers
    const unclaimedVouchers = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere(
        "transaction.ownerType = 'PROVIDER' AND transaction.status = 'UNCLAIMED'",
      )
      .getRawOne();

    // Claimed vouchers
    const claimedVouchers = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('COUNT(*)::integer', 'number')
      .addSelect('SUM(transaction.senderAmount)', 'value')
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .andWhere(
        "transaction.ownerType = 'PROVIDER' AND transaction.status = 'PENDING'",
      )
      .getRawOne();

    return {
      vouchersInOneWeek: {
        numberOfVouchers: vouchersInOneWeek.number,
        value: vouchersInOneWeek.value || 0,
      },
      vouchersInOneMonth: {
        numberOfVouchers: vouchersInOneMonth.number,
        value: vouchersInOneMonth.value || 0,
      },
      vouchersInThreeMonths: {
        numberOfVouchers: vouchersInThreeMonths.number,
        value: vouchersInThreeMonths.value || 0,
      },
      vouchersInSixMonths: {
        numberOfVouchers: vouchersInInSixMonths.number,
        value: vouchersInInSixMonths.value || 0,
      },
      vouchersInMaxTime: {
        numberOfVouchers: vouchersInMaxTime.number,
        value: vouchersInMaxTime.value || 0,
      },
      pendingVouchers: {
        numberOfVouchers: pendingVouchers.number,
        value: pendingVouchers.value || 0,
      },
      redeemedVouchers: {
        numberOfVouchers: redeemedVouchers.number,
        value: redeemedVouchers.value || 0,
      },
      unclaimedVouchers: {
        numberOfVouchers: unclaimedVouchers.number,
        value: unclaimedVouchers.value || 0,
      },
      claimedVouchers: {
        numberOfVouchers: claimedVouchers.number,
        value: claimedVouchers.value || 0,
      },
    } as VoucherSummaryDto;

    //return {} as VoucherSummaryDto;
  }

  /**
   * This method is used to retrieve list of all vouchers
   * @returns
   */
  async getAllVouchers(): Promise<VoucherListDto[]> {
    const vouchers = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select([
        'transaction.amount',
        'transaction.senderAmount',
        'transaction.senderId',
        'transaction.ownerId',
        'transaction.status',
      ])
      .addSelect("transaction.voucher->>'id'", 'transaction_id')
      .addSelect(
        "transaction.voucher->>'patientId'",
        'transaction_voucher_beneficiary',
      )
      .where("transaction.senderCurrency IN ('eur','EUR')")
      .getRawMany();

    // return vouchers as VoucherListDto[];
    return vouchers.map((voucher) => {
      return {
        voucherId: voucher.transaction_id,
        voucherValueLocal: voucher.transaction_amount,
        voucherValueEUR: voucher.transaction_sender_amount,
        voucherPayerId: voucher.transaction_sender_id,
        voucherBeneficiaryId: voucher.transaction_voucher_beneficiary,
        voucherOwnerId: voucher.transaction_owner_id,
        voucherStatus:
          voucher.status === 'BURNED'
            ? 'burned'
            : voucher.status === 'CLAIMED'
            ? 'redeemed'
            : 'unredeemed',
      };
    }) as VoucherListDto[];
  }
}
