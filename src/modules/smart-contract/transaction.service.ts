import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config/app-config.service';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    private readonly appConfigService: AppConfigService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  /**
   * This function is used to get transaction history
   * TODO: add pagination later!
   * @returns {Promise<any>}
   */
  async getTransactionHistory(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
