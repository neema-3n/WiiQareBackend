import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../smart-contract/entities/transaction.entity';
import { Patient } from './entities/patient.entity';
import { PatientSvcService } from './patient-svc.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Transaction])],
  providers: [PatientSvcService],
  exports: [PatientSvcService],
})
export class PatientSvcModule {}
