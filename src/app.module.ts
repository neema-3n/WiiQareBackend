import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AdminstrationSvcModule } from './modules/adminstration-svc/adminstration-svc.module';
import { PatientSvcModule } from './modules/patient-svc/patient-svc.module';
import { ProviderSvcModule } from './modules/provider-svc/provider-svc.module';
import { PayerSvcModule } from './modules/payer-svc/payer-svc.module';
import { AppConfigModule } from './config/app-config.module';

@Module({
  imports: [
    AppConfigModule,
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
