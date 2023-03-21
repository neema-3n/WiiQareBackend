import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import { validateEnvVars } from './validate-env-vars';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvVars,
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
