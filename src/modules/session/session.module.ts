import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { PayerSvcModule } from '../payer-svc/payer-svc.module';
import { MailModule } from '../mail/mail.module';
import { ProviderSvcModule } from '../provider-svc/provider-svc.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PayerSvcModule,
    ProviderSvcModule,
    MailModule,
  ],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}
