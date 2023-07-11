import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { VoucherDTO, VoucherSummaryDTO } from './dto/voucher.dto';

@ApiTags('admin/vouchers')
@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get('summary')
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'API endpoint to get summary list of all Vouchers informations',
  })
  async getSummary(): Promise<VoucherSummaryDTO> {
    return await this.voucherService.getSummary();
  }

  @Get()
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'This API is used retrieve list of all vouchers.',
  })
  async getAllVouchers(
    @Query('take', ParseIntPipe) take: number,
    @Query('skip', ParseIntPipe) skip: number,
  ): Promise<VoucherDTO[]> {
    return await this.voucherService.getAllVouchers(take, skip);
  }
}
