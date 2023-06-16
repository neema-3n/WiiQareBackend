import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Payer } from '../payer-svc/entities/payer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../smart-contract/entities/transaction.entity';
import { createAdminAccountDTO } from './dto/administration-svc.dto';
import { User } from '../session/entities/user.entity';
import { UserRole, UserStatus } from 'src/common/constants/enums';
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
   * This method is used to get summary of payers information
   * @returns
   */
  getPayersSummary() {
    return 'payers summary';
  }

  /**
   * Method use to create a new admin Account on Wiiqare
   * @param payload
   * @returns User
   */
  registerNewAdminAccount(payload: createAdminAccountDTO): Promise<User> {
    const { email, username, password } = payload;

    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    const adminUserTobeCreated = {
      email,
      username,
      password: hashedPassword,
      role: UserRole.WIIQARE_ADMIN,
      status: UserStatus.ACTIVE,
    };

    return this.UserRepository.save(adminUserTobeCreated);
  }
}
