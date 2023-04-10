import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { MintVoucherDto, TransferVoucherDto } from './dto/mint-voucher.dto';
import { SmartContractService } from './smart-contract.service';

@ApiTags('smart-contract')
@Controller('smart-contract')
export class SmartContractController {
  constructor(private readonly smartContractService: SmartContractService) {}

  /**
   * @deprecated to be removed!
   * @param payload
   * @returns
   */
  @Post()
  @Public()
  async testVoucher(@Body() payload: MintVoucherDto) {
    return await this.smartContractService.mintVoucher(payload);
  }

  @Post('transfer')
  @Public()
  @ApiOperation({ summary: 'This API transfer voucher to another owner' })
  async transferVoucher(@Body() payload: TransferVoucherDto) {
    const { voucherId, ownerId } = payload;
    return await this.smartContractService.transferVoucher(voucherId, ownerId);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'This API get all vouchers of an owner' })
  async getVoucherInformation(@Query('ownerId') ownerId: string) {
    return await this.smartContractService.getAllVouchers(ownerId);
  }

  @Get('by-id')
  @Public()
  @ApiOperation({ summary: 'This API get voucher by id' })
  async getVoucherById(@Query('voucherId') voucherId: string) {
    return await this.smartContractService.getVoucherById(voucherId);
  }
}
