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
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'class-validator';
import { UserRole } from 'src/common/constants/enums';
import { Roles } from 'src/common/decorators/user-role.decorator';
import { Repository } from 'typeorm';
import { _403, _404, _409 } from '../../common/constants/errors';
import { Public } from '../../common/decorators/public.decorator';
import { CachingService } from '../caching/caching.service';
import { CreatePatientDto, PatientResponseDto } from '../patient-svc/dto/patient.dto';
import { PatientSvcService } from '../patient-svc/patient-svc.service';
import { User } from '../session/entities/user.entity';
import { SessionService } from '../session/session.service';
import { CreatePayerAccountDto } from './dto/payer.dto';
import { Payer } from './entities/payer.entity';
import { PayerSvcService } from './payer-svc.service';

@ApiTags('Payer')
@Controller('payer')
export class PayerSvcController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly payerService: PayerSvcService,
    private readonly cachingService: CachingService,
    private readonly sessionService: SessionService,
    private readonly patientService: PatientSvcService,
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

  @Get('patient/:phoneNumber')
  @Roles(UserRole.PAYER)
  @ApiOperation({
    summary: 'This API is used retrieve Patient information by phoneNumber.',
  })
  async retrievePatientByPhoneNumber(
    @Param('phoneNumber') phoneNumber: string,
  ): Promise<PatientResponseDto> {
    return await this.patientService.findPatientByPhoneNumber(phoneNumber);
  }

  @Post('patient')
  @Roles(UserRole.PAYER)
  @ApiOperation({
    summary: 'This API is used register new Patient by PAYER.',
  })
  async registerNewPatient(
    @Body() createPatientAccountDto: CreatePatientDto,
  ): Promise<PatientResponseDto> {
    return await this.patientService.registerPatient(createPatientAccountDto);
  }
}
