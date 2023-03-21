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
    AdminstrationSvcModule,
    PatientSvcModule,
    PayerSvcModule,
    ProviderSvcModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
