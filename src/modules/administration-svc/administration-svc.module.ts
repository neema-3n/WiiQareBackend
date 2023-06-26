import { Module } from '@nestjs/common';

import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { Payer } from '../payer-svc/entities/payer.entity';
import { Transaction } from '../smart-contract/entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../session/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payer, Transaction, User])],
  providers: [AdminService,],
  controllers: [AdminController, ],
})
export class AdministrationSvcModule {}
