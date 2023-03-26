import { Module } from '@nestjs/common';
import { StripeModule } from 'nestjs-stripe';
import { PaymentController } from './payment.controller';
import { SmartContractController } from './smart-contract.controller';
import { nodeProvider } from './smart-contract.providers';
import { SmartContractService } from './smart-contract.service';

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: 'my_secret_key',
      apiVersion: '2022-11-15',
    }),
  ],
  controllers: [SmartContractController, PaymentController],
  providers: [SmartContractService, nodeProvider],
})
export class SmartContractModule {}
