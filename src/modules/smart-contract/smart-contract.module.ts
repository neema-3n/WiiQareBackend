import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModule } from 'nestjs-stripe';
import { Transaction } from './entities/transaction.entity';
import { PaymentController } from './payment.controller';
import { SmartContractController } from './smart-contract.controller';
import { nodeProvider } from './smart-contract.providers';
import { SmartContractService } from './smart-contract.service';

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: 'my_secret_key', // NOTICE: no keys we are using so far only webhooks!
      apiVersion: '2022-11-15',
    }),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [SmartContractController, PaymentController],
  providers: [SmartContractService, nodeProvider],
})
export class SmartContractModule {}
