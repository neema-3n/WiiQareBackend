import { DataSource } from 'typeorm';
import { BeneficiaryService } from './beneficiary.service';
import * as BeneficiarySummary from './querybuilders/getBeneficiarySummary.qb';
import * as BeneficiariesQueryBuilder from './querybuilders/getAllbeneficiary.qb';
import { be } from 'date-fns/locale';

describe('BeneficiaryService', () => {
  let service: BeneficiaryService;

  beforeEach(async () => {
    const dataSource: DataSource = {} as DataSource;
    service = new BeneficiaryService(dataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getSummary', async () => {
    jest
      .spyOn(
        BeneficiarySummary,
        'getNumberOfRegisteredBeneficiariesQueryBuilder',
      )
      .mockReturnValue({
        getRawOne: jest.fn().mockResolvedValue({}),
      } as any);

    jest
      .spyOn(
        BeneficiarySummary,
        'getPendingVouchersForAllBeneficiariesQueryBuilder',
      )
      .mockReturnValue({
        getRawOne: jest.fn().mockResolvedValue({}),
      } as any);

    jest
      .spyOn(
        BeneficiarySummary,
        'getRedeemedVouchersForAllBeneficiariesQueryBuilder',
      )
      .mockReturnValue({
        getRawOne: jest.fn().mockResolvedValue({}),
      } as any);

    jest
      .spyOn(
        BeneficiarySummary,
        'getBeneficiaryToProviderTransactionsQueryBuilder',
      )
      .mockReturnValue({
        getRawOne: jest.fn().mockResolvedValue({}),
      } as any);

    jest
      .spyOn(BeneficiarySummary, 'getActiveBeneficiariesQueryBuilder')
      .mockReturnValue({
        getRawOne: jest.fn().mockResolvedValue({}),
      } as any);

    const summary = await service.getSummary();
    expect(summary).toBeDefined();
  });

  it('findAllBeneficiaries', async () => {
    const beneficiary = {
      id: 1,
      name: 'test',
      country: 'IND',
      registrationDate: 'test',
      totalNumberOfDistinctPayers: 1,
      totalNumberOfDistinctProviders: 1,
      totalPayment: 1,
      totalPaymentCount: 1,
      numberOfActiveVouchers: 1,
      totalAmountOfActiveVouchers: 1,
      numberOfPendingVouchers: 1,
      totalAmountOfPendingVouchers: 1,
      numberOfUnclaimedVouchers: 1,
      totalAmountOfUnclaimedVouchers: 1,
      numberOfRedeemedVouchers: 1,
      totalAmountOfRedeemedVouchers: 1,
    };
    jest
      .spyOn(BeneficiariesQueryBuilder, 'getAllBeneficiariesQueryBuilder')
      .mockReturnValue({
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([beneficiary]),
      } as any);

    const beneficiaries = await service.findAllBeneficiaries();
    expect(beneficiaries).toStrictEqual([
      {
        id: 1,
        name: 'test',
        country: 'India',
        registrationDate: 'test',
        lastActivityOn: '',
        totalNumberOfDistinctPayers: 1,
        totalNumberOfDistinctProviders: 1,
        currency: 'EUR',
        totalPayment: {
          numberOfPayments: 1,
          value: 1,
        },
        activeVouchers: {
          numberOfVouchers: 1,
          value: 1,
        },
        pendingVouchers: {
          numberOfVouchers: 1,
          value: 1,
        },
        unclaimedVouchers: {
          numberOfVouchers: 1,
          value: 1,
        },
        redeemedVouchers: {
          numberOfVouchers: 1,
          value: 1,
        },
      },
    ]);
  });
});
