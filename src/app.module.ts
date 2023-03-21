import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AdminstrationSvcModule } from './modules/adminstration-svc/adminstration-svc.module';
import { PatientSvcModule } from './modules/patient-svc/patient-svc.module';
import { ProviderSvcModule } from './modules/provider-svc/provider-svc.module';
import { PayerSvcModule } from './modules/payer-svc/payer-svc.module';
import { AppConfigModule } from './config/app-config.module';
import { TypeOrmConfigService } from './db/typeorm-config.service';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './config/app-config.service';
import { ConfigService } from '@nestjs/config';
import { SessionModule } from './modules/session/session.module';
import { AuthModule } from './auth/auth.module';
import { GlobalExceptionsFilter } from './common/filters/global-exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JWTAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
      extraProviders: [ConfigService, AppConfigService],
    }),
    AuthModule,
    SessionModule,
    AdminstrationSvcModule,
    PatientSvcModule,
    PayerSvcModule,
    ProviderSvcModule,
    CommonModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionsFilter },
    { provide: APP_GUARD, useClass: JWTAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
