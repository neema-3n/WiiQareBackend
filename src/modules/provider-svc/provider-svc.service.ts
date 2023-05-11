import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { APP_NAME, DAY } from 'src/common/constants/constants';
import { UserRole, UserStatus } from 'src/common/constants/enums';
import { _403 } from 'src/common/constants/errors';
import { generateToken } from 'src/helpers/common.helper';
import { Repository } from 'typeorm';
import { CachingService } from '../caching/caching.service';
import { MailService } from '../mail/mail.service';
import { ObjectStorageService } from '../object-storage/object-storage.service';
import { User } from '../session/entities/user.entity';
import { SessionService } from '../session/session.service';
import {
  ProviderValidateEmailDto,
  RegisterProviderDto,
} from './dto/provider.dto';
import { Provider } from './entities/provider.entity';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private objectStorageService: ObjectStorageService,
    private sessionService: SessionService,
    private cachingService: CachingService,
    private mailService: MailService,
  ) {}

  async providerVerifyEmail(payload: ProviderValidateEmailDto): Promise<void> {
    const { email, password } = payload;
    // generate random reset password token
    const verifyToken = generateToken();

    // save reset token in cache
    const cacheToken = `${APP_NAME}:email:${verifyToken}`;

    const dataToSave: { email: string; password: string } = {
      email,
      password,
    };

    // cache key with 1 day ttl
    await this.cachingService.save<{ email: string; password: string }>(
      cacheToken,
      dataToSave,
      DAY,
    );

    // send email to the user
    await this.mailService.sendProviderVerificationEmail(email, verifyToken);
  }

  async registerNewProvider(
    logo: Express.Multer.File,
    payload: RegisterProviderDto,
  ): Promise<Record<string, any>> {
    const {
      name,
      address,
      businessRegistrationNo,
      nationalId,
      businessType,
      phone,
      city,
      postalCode,
      emailVerificationToken,
      contactPerson,
    } = payload;

    const result = await this.objectStorageService.saveObject(logo);

    // Get the email and user of the creator!.
    const cacheToken = `${APP_NAME}:email:${emailVerificationToken}`;

    const dataCached: { email: string; password: string } =
      await this.cachingService.get<{
        email: string;
        password: string;
      }>(cacheToken);
    if (!dataCached)
      throw new ForbiddenException(_403.INVALID_EMAIL_VERIFICATION_TOKEN);

    const { email, password } = dataCached;

    const hashedPassword = bcrypt.hashSync(password, 10);
    // TODO: use transaction to save both user and provider!
    const [_, provider] = await Promise.all([
      // Save a user account!
      this.userRepository.save({
        email,
        password: hashedPassword,
        phoneNumber: phone,
        role: UserRole.PROVIDER,
        status: UserStatus.INACTIVE,
      }),

      // register new provider
      this.providerRepository.save({
        email,
        logoLink: 'https://google.com/logo',
        name,
        address,
        businessRegistrationNo,
        nationalId,
        businessType,
        phone,
        city,
        postalCode,
        emailVerificationToken,
        contactPerson,
      }),
    ]);
    return {
      id: provider.id,
      providerName: provider.name,
      address: provider.address,
      businessType: provider.businessType,
      businessRegistrationNo: provider.businessRegistrationNo,
      city: provider.city,
      email: provider.email,
    };
  }
}
