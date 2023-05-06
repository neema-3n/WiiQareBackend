import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { ObjectStorageModule } from '../object-storage/object-storage.module';
import { SessionModule } from '../session/session.module';
import { Provider } from './entities/provider.entity';
import { ProviderService } from './provider-svc.service';
import { ProviderController } from './proviser-svc.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Provider]),
    ObjectStorageModule,
    SessionModule,
    MailModule,
  ],
  controllers: [ProviderController],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderSvcModule {}
