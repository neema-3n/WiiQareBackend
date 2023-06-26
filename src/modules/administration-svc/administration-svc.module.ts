import { Module } from '@nestjs/common';

import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { Payer } from '../payer-svc/entities/payer.entity';
import { Transaction } from '../smart-contract/entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../session/entities/user.entity';
import { PayerService } from './payers/payers.service';
import { PayerController } from './payers/payers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payer, Transaction, User])],
  providers: [AdminService, PayerService],
  controllers: [AdminController, PayerController],
})
export class AdministrationSvcModule {}
