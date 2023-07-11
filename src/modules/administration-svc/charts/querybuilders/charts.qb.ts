import { subMonths } from 'date-fns';
import { Patient } from 'src/modules/patient-svc/entities/patient.entity';
import { Payer } from 'src/modules/payer-svc/entities/payer.entity';
import { Transaction } from 'src/modules/smart-contract/entities/transaction.entity';
import { DataSource, SelectQueryBuilder } from 'typeorm';

export async function getNumberOfRegisteredPayersPerCountryQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Payer>> {
  return await dataSource
    .createQueryBuilder()
    .from(Payer, 'payer')
    .addSelect('COUNT(payer.id)::integer', 'count')
    .addSelect('payer.country', 'country')
    .groupBy('"country"')
    .orderBy('COUNT(payer.id)', 'DESC');
}

export async function getNumberOfActivePayersPerCountryQueryBuilder(
  dataSource: DataSource,
) {
  return dataSource
    .createQueryBuilder()
    .from(Payer, 'payer')
    .leftJoin(Transaction, 'transaction', 'transaction.senderId=payer.id')
    .addSelect('COUNT(payer.id)::integer', 'count')
    .addSelect('payer.country', 'country')
    .where("transaction.senderCurrency IN ('eur','EUR')")
    .andWhere('transaction.createdAt >= :datePrior', {
      datePrior: subMonths(Date.now(), 6),
    })
    .groupBy('"country"')
    .orderBy('COUNT(payer.id)', 'DESC');
}

export async function getNumberOfRegisteredBeneficiariesPerCountryQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Patient>> {
  return await dataSource
    .createQueryBuilder()
    .from(Patient, 'patient')
    .addSelect('COUNT(patient.id)::integer', 'count')
    .addSelect('patient.country', 'country')
    .groupBy('"country"')
    .orderBy('COUNT(patient.id)', 'DESC');
}

export async function getActiveBeneficiariesPerCountryQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Patient>> {
  return await dataSource
    .createQueryBuilder()
    .from(Patient, 'patient')
    .leftJoin(
      Transaction,
      'transaction',
      `patient.id::text = transaction.voucher->>'patientId'`,
    )
    .addSelect(
      `COUNT(DISTINCT transaction.voucher->>'patientId')::integer`,
      'count',
    )
    .addSelect('patient.country', 'country')

    .where('transaction.updatedAt >= :datePrior', {
      datePrior: subMonths(Date.now(), 6),
    })
    .andWhere("transaction.senderCurrency IN ('eur','EUR')")
    .groupBy('"country"')
    .orderBy(`COUNT(DISTINCT transaction.voucher->>'patientId')`, 'DESC');
}
