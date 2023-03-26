import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { SmartContractService } from './smart-contract.service';

@ApiTags('smart-contract')
@Controller('smart-contract')
export class SmartContractController {
  constructor(private readonly smartContractService: SmartContractService) {}
  @Post()
  @Public()
  async testVoucher() {
    const response = await this.smartContractService.mintVoucher();
    return response;
  }

  @Get()
  @Public()
  async getVoucherInformation() {
    const response = await this.smartContractService.getVoucher();
    return response;
  }
}
