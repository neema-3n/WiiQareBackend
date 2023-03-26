import { Module } from '@nestjs/common';
import { nodeProvider } from './smart-contract.providers';
import { SmartContractService } from './smart-contract.service';
import { SmartContractController } from './smart-contract.controller';

@Module({
  controllers: [SmartContractController],
  providers: [SmartContractService, nodeProvider],
})
export class SmartContractModule {}
