import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BeneficiaryService } from './beneficiary.service';
import { Public } from 'src/common/decorators/public.decorator';
import { BeneficiaryDTO, BeneficiarySummaryDTO } from './dto/beneficiary.dto';

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
  async getAllBeneficiaries(
    @Query('take', ParseIntPipe) take: number,
    @Query('skip', ParseIntPipe) skip: number,
  ): Promise<Array<BeneficiaryDTO>> {
    return await this.beneficiaryService.findAllBeneficiaries(take, skip);
  }

  @Get('summary')
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'API endpoint to get summary  of all Beneficiaries informations',
  })
  async getSummary(): Promise<BeneficiarySummaryDTO> {
    return await this.beneficiaryService.getSummary();
  }
}
