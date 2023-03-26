import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientSvcService } from './patient-svc.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  providers: [PatientSvcService],
  exports: [PatientSvcService],
})
export class PatientSvcModule {}
