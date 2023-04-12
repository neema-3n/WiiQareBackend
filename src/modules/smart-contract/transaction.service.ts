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
  async getAllTransactionHistory(): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * This function is used to get transaction history from payer id
   * TODO: add pagination later!
   * @returns {Promise<any>}
   */
  async getTransactionHistoryByPayerId(
    payerId: string,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: {
        id: payerId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
