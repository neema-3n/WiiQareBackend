import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Payer } from '../payer-svc/entities/payer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../smart-contract/entities/transaction.entity';
import { createAdminAccountDTO } from './dto/administration-svc.dto';
import { User } from '../session/entities/user.entity';
import {
  UserRole,
  UserStatus,
  VoucherStatus,
} from 'src/common/constants/enums';
import { SALT_ROUNDS } from 'src/common/constants/constants';

@Injectable()
export class AdministrationSvcService {
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
  async getPayersSummary() {
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

    return {
      numberOfRegisteredPayers,
      totalNumberOfPurchasedVouchers,
      totalNumberOfPendingVouchers,
      totalNumberOfRedeemedVouchers,
    };
  }

  /**
   * Method use to create a new admin Account on Wiiqare
   * @param payload
   * @returns User
   */
  async registerNewAdminAccount(payload: createAdminAccountDTO): Promise<User> {
    const { email, password } = payload;

    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    const adminUserTobeCreated = {
      email,
      password: hashedPassword,
      role: UserRole.WIIQARE_ADMIN,
      status: UserStatus.ACTIVE,
    };

    return this.UserRepository.save(adminUserTobeCreated);
  }
}
