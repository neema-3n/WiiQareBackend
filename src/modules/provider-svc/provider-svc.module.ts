import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { ObjectStorageModule } from '../object-storage/object-storage.module';
import { User } from '../session/entities/user.entity';
import { Provider } from './entities/provider.entity';
import { ProviderService } from './provider-svc.service';
import { ProviderController } from './provider-svc.controller';
import { Transaction } from '../smart-contract/entities/transaction.entity';
import { Patient } from '../patient-svc/entities/patient.entity';
import { SMSModule } from '../sms/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provider, User, Transaction, Patient]),
    ObjectStorageModule,
    MailModule,
    SMSModule,
  ],
  controllers: [ProviderController],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderSvcModule {}
