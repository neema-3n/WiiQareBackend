import { DataSource } from 'typeorm';
import { PayerService } from './payer.service';
import * as PayerSummary from './querybuilders/getPayerSummary.qb';
import * as PayersQueryBuilder from './querybuilders/getAllPayers.qb';

describe('PayerService', () => {
  let service: PayerService;

  beforeEach(async () => {
    const dataSource: DataSource = {} as DataSource;
    service = new PayerService(dataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return payer summary', async () => {
    jest
      .spyOn(PayerSummary, 'getNumberOfRegisteredPayersQueryBuilder')
      .mockReturnValue({
        getRawOne: jest.fn().mockResolvedValue({}),
      } as any);

    jest
      .spyOn(PayerSummary, 'getAllPayersPurchasedVouchersInfoQueryBuilder')
      .mockReturnValue({
        getRawOne: jest.fn().mockResolvedValue({}),
      } as any);

    jest
      .spyOn(PayerSummary, 'getAllPayersPendingVouchersInfoQueryBuilder')
      .mockReturnValue({
        getRawOne: jest.fn().mockResolvedValue({}),
      } as any);

    jest
      .spyOn(PayerSummary, 'getAllPayersRedeemedVouchersInfoQueryBuilder')
      .mockReturnValue({
        getRawOne: jest.fn().mockResolvedValue({}),
      } as any);

    jest
      .spyOn(PayerSummary, 'getNumberOfActivePayersQueryBuilder')
      .mockReturnValue({
        getRawOne: jest.fn().mockResolvedValue({}),
      } as any);
    const summary = await service.getSummary();
    expect(summary).toBeDefined();
  });

  it('should return all payers', async () => {
    jest.spyOn(PayersQueryBuilder, 'getAllPayersQueryBuilder').mockReturnValue({
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([
        {
          id: 1,
          name: 'test',
          country: 'IND',
          registrationDate: '2021-08-10T00:00:00.000Z',
          uniqueBeneficiaryCount: 1,
          totalNumberOfPurchasedVouchers: 1,
          totalAmountOfPurchasedVouchers: 1,
          totalNumberOfPendingVouchers: 1,
          totalAmountOfPendingVouchers: 1,
          totalNumberOfUnclaimedVouchers: 1,
          totalAmountOfUnclaimedVouchers: 1,
          totalNumberOfRedeemedVouchers: 1,
          totalAmountOfRedeemedVouchers: 1,
        },
      ]),
    } as any);
    const payers = await service.findAllPayers();
    expect(payers).toEqual([
      {
        id: 1,
        name: 'test',
        country: 'India',
        registrationDate: '2021-08-10T00:00:00.000Z',
        lastActivityOn: '',
        uniqueBeneficiaryCount: 1,
        currency: 'EUR',
        purchasedVouchers: {
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
        vouchersNotSent: {
          numberOfVouchers: 0,
          value: 0,
        },
      },
    ]);
  });
});
