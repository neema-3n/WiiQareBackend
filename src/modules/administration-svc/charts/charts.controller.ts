import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constants/enums';
import { Roles } from 'src/common/decorators/user-role.decorator';
import { ChartsDTO } from './dto/chart.dto';

@ApiTags('admin/charts')
@Controller('charts')
export class ChartsController {
  constructor(private chartService: ChartsService) {}

  @Get()
  @Roles(UserRole.WIIQARE_ADMIN)
  @ApiOperation({
    summary:
      'API endpoint to get informations used for charts on the homepage of dashboard',
    description:
      'Gathers information of countries with most registered and active payers and beneficiaries respectively',
  })
  async getChartsInfo(
    @Query('take', ParseIntPipe) take: number,
  ): Promise<ChartsDTO> {
    return await this.chartService.findChartsInfo(take);
  }
}
