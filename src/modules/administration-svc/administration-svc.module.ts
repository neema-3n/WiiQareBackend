import { Module } from '@nestjs/common';


import { Payer } from '../payer-svc/entities/payer.entity';
import { Transaction } from '../smart-contract/entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../session/entities/user.entity';
import { PayerService } from './payer/payer.service';
import { PayerController } from './payer/payer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payer, Transaction, User])],
  providers: [PayerService],
  controllers: [ PayerController],
})
export class AdministrationSvcModule {}
