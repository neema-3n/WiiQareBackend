import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePayerAccountDto } from './dto/payer.dto';
import { Payer } from './entities/payer.entity';
import { PayerSvcService } from './payer-svc.service';
import { Public } from '../../common/decorators/public.decorator';
import { _403, _404, _409 } from '../../common/constants/errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../session/entities/user.entity';
import { CachingService } from '../caching/caching.service';
import _ from 'lodash';
import { SessionService } from '../session/session.service';
import { isEmpty } from 'class-validator';

@ApiTags('Payer')
@Controller('payer')
export class PayerSvcController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly payerService: PayerSvcService,
    private readonly cachingService: CachingService,
    private readonly sessionService: SessionService,
  ) {}

  @Get(':id')
  // @Roles(UserRole.PAYER)
  @Public()
  @ApiOperation({ summary: 'This API is used retrieve Payer information.' })
  async retrievePayerAccountInfo(
    @Param('id', new ParseUUIDPipe({ version: '4' })) payerId: string,
  ): Promise<Payer> {
    const payerAccount = await this.payerService.findPayerById(payerId);

    if (!payerAccount) throw new NotFoundException(_404.PAYER_NOT_FOUND);

    return payerAccount;
  }

  @Post()
  @Public()
  @ApiOperation({
    summary: 'This API is used register Payer and create his/her an account.',
  })
  async createPayerAccount(
    @Body() createPayerAccount: CreatePayerAccountDto,
  ): Promise<Payer> {
    const { email, phoneNumber, emailVerificationToken } = createPayerAccount;

    //check if email is valid (otp not expired!).
    const dataToHash: string = await this.cachingService.get(
      `wiiQare:email:verify:${email}`,
    );

    if (isEmpty(dataToHash))
      throw new ForbiddenException(_403.EMAIL_VERIFICATION_REQUIRED);

    const hashedData = this.sessionService.hashDataToHex(dataToHash);
    if (hashedData !== emailVerificationToken)
      throw new ForbiddenException(_403.EMAIL_VERIFICATION_REQUIRED);

    // check if user doesn't exists!
    const userExists = await this.userRepository
      .createQueryBuilder('user')
      .where(`user.email = :email`, { email })
      .orWhere(`user.phoneNumber = :phoneNumber`, { phoneNumber })
      .getOne();

    if (userExists) throw new ConflictException(_409.USER_ALREADY_EXISTS);

    return this.payerService.registerNewPayerAccount(createPayerAccount);
  }
}
