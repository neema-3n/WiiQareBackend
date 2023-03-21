import { Module } from '@nestjs/common';
import { PayerSvcController } from './payer-svc.controller';
import { PayerSvcService } from './payer-svc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payer } from './entities/payer.entity';
import { User } from '../session/entities/user.entity';
import { CachingModule } from '../caching/caching.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payer, User]), CachingModule],
  controllers: [PayerSvcController],
  providers: [PayerSvcService],
  exports: [PayerSvcService],
})
export class PayerSvcModule {}
