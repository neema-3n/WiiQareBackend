import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { PatientSvcModule } from '../patient-svc/patient-svc.module';
import { User } from '../session/entities/user.entity';
import { SessionModule } from '../session/session.module';
import { SMSModule } from '../sms/sms.module';
import { Payer } from './entities/payer.entity';
import { PayerSvcController } from './payer-svc.controller';
import { PayerSvcService } from './payer-svc.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payer, User]),
    forwardRef(() => SessionModule),
    MailModule,
    PatientSvcModule,
    SMSModule,
  ],
  controllers: [PayerSvcController],
  providers: [PayerSvcService],
  exports: [PayerSvcService],
})
export class PayerSvcModule { }
