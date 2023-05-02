import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AppConfigService } from '../../config/app-config.service';
import { Payer } from './entities/payer.entity';
import { CreatePayerAccountDto } from './dto/payer.dto';
import { User } from '../session/entities/user.entity';
import { UserRole, UserStatus } from '../../common/constants/enums';
import { SALT_ROUNDS } from '../../common/constants/constants';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../../db/data-source';

@Injectable()
export class PayerSvcService {
  constructor(
    @InjectRepository(Payer)
    private readonly payerRepository: Repository<Payer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource(AppDataSource) private readonly dataSource: DataSource,
    private readonly appConfigService: AppConfigService,
  ) {}

  /**
   * This function retrieve payer account related by Entity Id
   *
   * @param payerId
   */
  async findPayerById(payerId: string): Promise<Payer> {
    return this.payerRepository.findOne({
      where: {
        id: payerId,
      },
      relations: {
        user: true,
      },
    });
  }

  /**
   * This function retrieve payer account related to a user account
   *
   * @param userId
   */
  async findPayerByUserId(userId: string): Promise<Payer> {
    return this.payerRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  /**
   * This function is used to created Payer account on wiiQrare
   *
   */
  async registerNewPayerAccount(
    payload: CreatePayerAccountDto,
  ): Promise<Payer> {
    const { phoneNumber, email, firstName, lastName, password, country } =
      payload;

    const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    // Get next sequence
    const [result] = await this.dataSource
      .createQueryBuilder()
      .select(`nextval('referral_codes') as id`)
      .execute();

    const referralCode = `REF-${result.id}`;

    console.log(`see ->`, referralCode);

    const payerToBeCreated = this.payerRepository.create({
      user: {
        phoneNumber: phoneNumber,
        email: email,
        password: hashedPassword,
        role: UserRole.PAYER,
        status: UserStatus.ACTIVE,
      },
      firstName: firstName,
      lastName: lastName,
      country,
      referralCode,
    });
    return this.payerRepository.save(payerToBeCreated);
  }
}
