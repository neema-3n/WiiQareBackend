import { DataSource, Repository } from 'typeorm';
import { VoucherService } from './voucher.service';
import { Transaction } from '../../smart-contract/entities/transaction.entity';
import * as AllVouchersQueryBuilder from './querybuilders/getAllVouchers.qb';

describe('VoucherService', () => {
  let service: VoucherService;

  beforeEach(async () => {
    const txRepo: Repository<Transaction> = {} as Repository<Transaction>;
    const dataSource: DataSource = {} as DataSource;
    service = new VoucherService(txRepo, dataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getSummary', async () => {
    const txRepo: Repository<Transaction> = {
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({}),
      }),
    } as unknown as Repository<Transaction>;
    const dataSource: DataSource = {} as DataSource;
    service = new VoucherService(txRepo, dataSource);
    const summary = await service.getSummary();
    expect(summary).toBeDefined();
  });

  it('getAllVouchers', async () => {
    jest
      .spyOn(AllVouchersQueryBuilder, 'getAllVouchersQueryBuilder')
      .mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      } as any);

    const txRepo: Repository<Transaction> =
      {} as unknown as Repository<Transaction>;
    const dataSource: DataSource = {} as DataSource;
    service = new VoucherService(txRepo, dataSource);
    const vouchers = await service.getAllVouchers();
    expect(vouchers).toBeDefined();
  });
});
