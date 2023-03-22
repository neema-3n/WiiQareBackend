import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { _400, _401, _403, _404, _500 } from 'src/common/constants/errors';
import { User } from 'src/modules/session/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { AppConfigService } from '../../config/app-config.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtClaimsDataDto } from './dto/jwt-claims-data.dto';
import {
  SessionResponseDto,
  SessionVerifyEmailOTPResponseDto,
} from './dto/session.dto';
import { UserRole, UserStatus } from '../../common/constants/enums';
import { PayerSvcService } from '../payer-svc/payer-svc.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { logError, randomSixDigitNumber } from '../../helpers/common.helper';
import { CachingService } from '../caching/caching.service';
import * as crypto from 'crypto';
import { isEmpty } from 'class-validator';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    //TODO: Update this DataSource Later!.
    private readonly appConfigService: AppConfigService,
    private readonly payerService: PayerSvcService,
    private mailService: MailService,
    private cachingService: CachingService,
  ) {}

  async authenticateUser(
    payload: CreateSessionDto,
  ): Promise<SessionResponseDto> {
    const { password, phoneNumber, username, email } = payload;

    if (isEmpty(phoneNumber) && isEmpty(username) && isEmpty(email))
      throw new BadRequestException({
        ..._400.MALFORMED_INPUTS_PROVIDED,
        description: 'phone number or username or email is missing',
      });

    const user: User = await this.userRepository.findOne({
      where: [{ username }, { email }, { phoneNumber }],
    });

    if (!user) throw new NotFoundException(_404.USER_NOT_FOUND);

    if (user.status !== UserStatus.ACTIVE)
      throw new ForbiddenException(_403.USER_ACCOUNT_NOT_ACTIVE);

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

    if (isEmpty(randomSixDigitsNumber)) {
      logError(`see -> ${randomSixDigitsNumber}`);
      throw new InternalServerErrorException(_500.INTERNAL_SERVER_ERROR);
    }

    const key = `wiiQare:otp:${randomSixDigitsNumber}`;
    await this.cachingService.save(key, email, 180_000); //TTL 3min in mms

    return this.mailService.sendOTPEmail(email, randomSixDigitsNumber);
  }

  /**
   * This function validate if email and OTP user provided is valid
   * @param email
   * @param otpCode
   */
  async validateEmailOTP(
    email: string,
    otpCode: number,
  ): Promise<SessionVerifyEmailOTPResponseDto> {
    const isValid = await this.isValidOTP(otpCode, email);

    if (!isValid) throw new ForbiddenException(_403.OTP_VERIFICATION_FAILED);

    const emailVerificationToken = this.generateEmailVerificationHash(
      email,
      otpCode,
    );

    // save data we hashed with this we will compute hash again and match it with the provided one.
    await this.cachingService.save(
      `wiiQare:email:verify:${email}`,
      `${email}:${otpCode}`,
      900_000, // TTL 15min in mms
    );

    return {
      emailVerificationToken,
    } as SessionVerifyEmailOTPResponseDto;
  }

  async isValidOTP(otpCode: number, email: string): Promise<boolean> {
    const key = `wiiQare:otp:${otpCode}`;

    //NOTICE: auto-eviction from cache will cause it to fails if expired!.
    const otpOwnerEmail = await this.cachingService.get<string>(key);
    return email === otpOwnerEmail;
  }

  /**
   * This helper function hash given data and return digest in hex
   *
   * @param data
   */
  hashDataToHex(data: string): string {
    const hashSecret = this.appConfigService.hashingSecret;
    const hash = crypto.createHmac('sha512', hashSecret);
    return hash.update(data).digest('hex');
  }

  /**
   * This helper function generate email verification hash
   *
   * @param email
   * @param otpCode
   */
  generateEmailVerificationHash(email: string, otpCode: number): string {
    return this.hashDataToHex(`${email}:${otpCode}`);
  }
}
