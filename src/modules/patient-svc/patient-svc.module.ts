import { Module } from '@nestjs/common';
import { PatientSvcService } from './patient-svc.service';

@Module({
  providers: [PatientSvcService],
  exports: [PatientSvcService],
})
export class PatientSvcModule {}
