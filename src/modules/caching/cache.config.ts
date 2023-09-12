import {
  Injectable,
} from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class CacheConfig {
  constructor(private readonly configService: AppConfigService) {}

  createCacheOptions() {
    return this.configService.redisConfigOptions;
  }
}
