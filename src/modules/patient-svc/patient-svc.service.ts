import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { _404 } from 'src/common/constants/errors';
import { Repository } from 'typeorm';
import { CreatePatientDto, PatientSearchResponseDto } from './dto/patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientSvcService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  /**
   * This function is used to register a patient account
   */
  async registerPatient(patientDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create(patientDto);
    return await this.patientRepository.save(patient);
  }

  /**
   * This function is used to find a patient by his/her phone number
   */
  async findPatientByPhoneNumber(
    phoneNumber: string,
  ): Promise<PatientSearchResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { phoneNumber },
    });

    if (!patient) throw new NotFoundException(_404.PATIENT_NOT_FOUND);

    const { phoneNumber: phone, firstName, lastName, id } = patient;

    return {
      phoneNumber: phone,
      firstName,
      lastName,
      id,
    } as PatientSearchResponseDto;
  }
}
