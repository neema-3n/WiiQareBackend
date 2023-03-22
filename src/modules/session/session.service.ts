import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { _400, _401, _404 } from 'src/common/constants/errors';
import { User } from 'src/modules/session/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { AppConfigService } from '../../config/app-config.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtClaimsDataDto } from './dto/jwt-claims-data.dto';
import {
  SessionEmailVerifyResponseDto,
  SessionResponseDto,
} from './dto/session.dto';
import _ from 'lodash';
import { UserRole } from '../../common/constants/enums';
import { PayerSvcService } from '../payer-svc/payer-svc.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { randomSixDigitNumber } from '../../helpers/common.helper';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    //TODO: Update this DataSource Later!.
    private readonly appConfigService: AppConfigService,
    private readonly payerService: PayerSvcService,
    private mailService: MailService,
  ) {}

  async authenticateUser(
    payload: CreateSessionDto,
  ): Promise<SessionResponseDto> {
    const { password, phoneNumber, username, email } = payload;

    if (_.isEmpty(phoneNumber) && _.isEmpty(username) && _.isEmpty(email))
      throw new BadRequestException({
        ..._400.MALFORMED_INPUTS_PROVIDED,
        description: 'phone number or username or email is missing',
      });

    const user: User = await this.userRepository.findOne({
      where: [{ username }, { email }, { phoneNumber }],
    });

    if (!user) throw new NotFoundException(_404.USER_NOT_FOUND);

    let jwtClaimsData;

    if (user.role === UserRole.PAYER) {
      // retrieve payer information if payer //TODO: later retrieve this information at same time!.
      const payer = await this.payerService.findPayerByUserId(user.id);

      if (!payer) throw new NotFoundException(_404.PAYER_NOT_FOUND);

      const isValidPassword = bcrypt.compareSync(password, user.password);

      if (!isValidPassword)
        throw new UnauthorizedException(_401.INVALID_CREDENTIALS);

      jwtClaimsData = {
        sub: user.id,
        type: user.role,
        phoneNumber: user.phoneNumber,
        names: `${payer.firstName} ${payer.lastName}`,
        status: user.status,
      } as JwtClaimsDataDto;
    }

    const jsonWebToken = this.jwtService.sign(jwtClaimsData);

    return {
      access_token: jsonWebToken,
    } as SessionResponseDto;
  }

  /**
   * This function find one user!
   */
  async findOne(options: FindOneOptions<User>): Promise<User | undefined> {
    const user = await this.userRepository.findOne(options);

    if (!user) throw new NotFoundException(_404.USER_NOT_FOUND);

    return user;
  }

  /**
   * This function generate OTP for email verification
   *  and send it to customer (PAYER,PROVIDER,PATIENT)
   */
  async emailVerification(email: string): Promise<void> {
    const randomSixDigitsNumber = randomSixDigitNumber();
    return this.mailService.sendOTPEmail(email, randomSixDigitsNumber);
  }

  /**
   * This function validate if email and OTP user provided is valid
   * @param email
   */
  async validateEmailOTP(
    email: string,
  ): Promise<SessionEmailVerifyResponseDto> {
    return;
  }
}
