import { Controller, Get, Param } from '@nestjs/common';
import { PayerService } from './payer.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { PayerListDto } from './dto/payers.dto';

@ApiTags('admin/payers')
@Controller('payers')
export class PayerController {
  constructor(private readonly payerService: PayerService) {}

  @Get('summary')
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'API endpoint to get summary list of all Payers informations',
  })
  getSummary(): any {
    return this.payerService.getSummary();
  }

  @Get()
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'This API is used retrieve Migrant Payers List.',
  })
  async getAllPayers(): Promise<PayerListDto[]> {
    return this.payerService.findAllPayers();
  }

  @Get(':id')
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  getPayer(@Param() params: any) {
    return this.payerService.findPayer(params.id);
  }
}
