import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { APP_NAME, DAY } from 'src/common/constants/constants';
import { _403 } from 'src/common/constants/errors';
import { generateToken } from 'src/helpers/common.helper';
import { Repository } from 'typeorm';
import { CachingService } from '../caching/caching.service';
import { MailService } from '../mail/mail.service';
import { ObjectStorageService } from '../object-storage/object-storage.service';
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
    private objectStorageService: ObjectStorageService,
    private sessionService: SessionService,
    private cachingService: CachingService,
    private mailService: MailService,
  ) {}

  async providerVerifyEmail(payload: ProviderValidateEmailDto): Promise<void> {
    const { email } = payload;
    // generate random reset password token
    const verifyToken = generateToken();

    // save reset token in cache
    const cacheToken = `${APP_NAME}:email:${verifyToken}`;

    // cache key with 1 day ttl
    await this.cachingService.save(cacheToken, email, DAY);

    // send email to the user
    await this.mailService.sendProviderVerificationEmail(email, verifyToken);
  }

  async registerNewProvider(
    file: Express.Multer.File,
    payload: RegisterProviderDto,
  ): Promise<Provider> {
    const {
      name,
      address,
      businessRegistrationNo,
      nationalId,
      businessType,
      phone,
      city,
      postalCode,
      logo,
      emailVerificationToken,
    } = payload;

    // const result = await this.objectStorageService.saveObject(file);

    // Get the email and user of the creator!.
    const cacheToken = `${APP_NAME}:email:${emailVerificationToken}`;

    const email = await this.cachingService.get<string>(cacheToken);

    if (!email)
      throw new ForbiddenException(_403.INVALID_EMAIL_VERIFICATION_TOKEN);

    //TODO: save a user account!

    // register new provider
    return await this.providerRepository.save({
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
      logo,
      emailVerificationToken,
    });
  }
}
