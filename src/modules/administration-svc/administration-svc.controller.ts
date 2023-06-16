import { Body, ConflictException, Controller, Get, Post } from '@nestjs/common';
import { AdministrationSvcService } from './administration-svc.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  createAdminAccountDTO,
  createAdminAccountReponseDTO,
} from './dto/administration-svc.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../session/entities/user.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/user-role.decorator';
import { UserRole } from 'src/common/constants/enums';
import { _409 } from 'src/common/constants/errors';

@ApiTags('Admin')
@Controller('admin')
export class AdministrationSvcController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly administrationSvcService: AdministrationSvcService,
  ) {}

  @Get('payers/summary')
  @Roles(UserRole.WIIQARE_ADMIN)
  @ApiOperation({
    summary: 'API endpoint to get summary list of all Payers informations',
  })
  getSummary(): any {
    return this.administrationSvcService.getPayersSummary();
  }

  @Post()
  @Public()
  async createAdminAccount(
    @Body() createAdminAccount: createAdminAccountDTO,
  ): Promise<createAdminAccountReponseDTO> {
    // check if user doesn't exists!
    const userExists = await this.userRepository
      .createQueryBuilder('user')
      .where(`user.email = :email`, { email: createAdminAccount.email })
      .getOne();

    if (userExists) throw new ConflictException(_409.USER_ALREADY_EXISTS);

    const { id, email, username, status, role } =
      await this.administrationSvcService.registerNewAdminAccount(
        createAdminAccount,
      );

    return {
      userId: id,
      email,
      username,
      status,
      userRole: role,
    } as createAdminAccountReponseDTO;
  }
}
