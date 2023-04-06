import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { MintVoucherDto, TransferVoucherDto } from './dto/mint-voucher.dto';
import { SmartContractService } from './smart-contract.service';

@ApiTags('smart-contract')
@Controller('smart-contract')
export class SmartContractController {
  constructor(private readonly smartContractService: SmartContractService) {}
  @Post()
  @Public()
  async testVoucher(@Body() payload: MintVoucherDto) {
    return await this.smartContractService.mintVoucher(payload);
  }

  @Post('transfer')
  @Public()
  async transferVoucher(@Body() payload: TransferVoucherDto) {
    const { voucherId, ownerId } = payload;
    return await this.smartContractService.transferVoucher(voucherId, ownerId);
  }

  @Get()
  @Public()
  async getVoucherInformation(@Query('ownerId') ownerId: string) {
    return await this.smartContractService.getAllVouchers(ownerId);
  }

  @Get('by-id')
  @Public()
  async getVoucherById(@Query('voucherId') voucherId: string) {
    return await this.smartContractService.getVoucherById(voucherId);
  }
}
