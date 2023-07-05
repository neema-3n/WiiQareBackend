import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BeneficiaryService } from './beneficiary.service';
import { Public } from 'src/common/decorators/public.decorator';
import { BeneficiaryDTO } from './dto/beneficiary.dto';

@ApiTags('admin/beneficiaries')
@Controller('beneficiaries')
export class BeneficiaryController {
  constructor(private readonly beneficiaryService: BeneficiaryService) {}

  @Get()
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'API endpoint to get list of all Beneficiaries informations',
  })
  async getAllBeneficiaries(): Promise<Array<BeneficiaryDTO>> {
    return await this.beneficiaryService.findAllBeneficiaries();
  }

  @Get('summary')
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'API endpoint to get summary  of all Beneficiaries informations',
  })
  getSummary(@Query() query) {
    return { query };
    //return this.beneficiaryService.getSummary();
  }
}
