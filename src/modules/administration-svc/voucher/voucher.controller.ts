import { Controller, Get } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { VoucherListDto, VoucherSummaryDto } from './dto/voucher.dto';

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
  getSummary(): Promise<VoucherSummaryDto> {
    return this.voucherService.getSummary();
  }

  @Get()
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'This API is used retrieve list of all vouchers.',
  })
  async getAllVouchers(): Promise<VoucherListDto[]> {
    return this.voucherService.getAllVouchers();
  }
}
