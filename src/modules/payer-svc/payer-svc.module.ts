import { Module } from '@nestjs/common';
import { PayerSvcController } from './payer-svc.controller';
import { PayerSvcService } from './payer-svc.service';

@Module({
  controllers: [PayerSvcController],
  providers: [PayerSvcService]
})
export class PayerSvcModule {}
