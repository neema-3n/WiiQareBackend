import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { ProviderService } from './provider.service';
import { ProviderDTO } from './dto/provider.dto';

@ApiTags('admin/providers')
@Controller('providers')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}
  @Get()
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'API endpoint to get list of all Providers informations',
  })
  async getAllProviders(
    @Query('take', ParseIntPipe) take: number,
    @Query('skip', ParseIntPipe) skip: number,
  ): Promise<Array<ProviderDTO>> {
    return await this.providerService.findAllProviders(take, skip);
  }

  @Get('summary')
  //@Roles(UserRole.WIIQARE_ADMIN)
  @Public()
  @ApiOperation({
    summary: 'API endpoint to get summary informations related to providers',
  })
  async getProviderSummary() {
    return await this.providerService.getSummary();
  }
}
