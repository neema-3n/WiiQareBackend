import { Module } from '@nestjs/common';

import { AdministrationSvcService } from './administration-svc.service';
import { AdministrationSvcController } from './administration-svc.controller';
import { Payer } from '../payer-svc/entities/payer.entity';
import { Transaction } from '../smart-contract/entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../session/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payer, Transaction, User])],
  providers: [AdministrationSvcService],
  controllers: [AdministrationSvcController],
})
export class AdministrationSvcModule {}
