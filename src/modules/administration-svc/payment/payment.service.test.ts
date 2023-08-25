import { DataSource, Repository } from 'typeorm';
import { Transaction } from '../../smart-contract/entities/transaction.entity';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  it('should be defined', () => {
    const txRepo: Repository<Transaction> = {} as Repository<Transaction>;
    const dataSource: DataSource = {} as DataSource;
    const service = new PaymentService(txRepo, dataSource);
    expect(service).toBeDefined();
    expect(service.getSummary).toBeDefined();
    expect(service.getPaymentsFromPayer).toBeDefined();
    expect(service.getPaymentsDueProvider).toBeDefined();
  });

  it('should return a summary', async () => {
    const txRepo: Repository<Transaction> = {
      createQueryBuilder: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          addSelect: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              andWhere: jest.fn().mockReturnValue({
                getRawOne: jest.fn().mockResolvedValue({
                  number: 1,
                  value: 1,
                }),
              }),
              getRawOne: jest.fn().mockResolvedValue({
                number: 1,
                value: 1,
              }),
            }),
          }),
        }),
      }),
    } as unknown as Repository<Transaction>;
    const dataSource: DataSource = {
      createQueryBuilder: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            addSelect: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnValue({
                getRawOne: jest.fn().mockResolvedValue({
                  numberOfPayerPayments: 1,
                }),
                andWhere: jest.fn().mockReturnValue({
                  getRawOne: jest.fn().mockResolvedValue({
                    numberOfProviderPayments: 1,
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    } as unknown as DataSource;
    const service = new PaymentService(txRepo, dataSource);

    const summary = await service.getSummary();

    expect(summary).toBeDefined();
  });

  it('should return payments from payer', async () => {
    const txRepo: Repository<Transaction> = {} as Repository<Transaction>;
    const dataSource: DataSource = {
      createQueryBuilder: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            leftJoin: jest.fn().mockReturnValue({
              addSelect: jest.fn().mockReturnValue({
                addSelect: jest.fn().mockReturnValue({
                  addSelect: jest.fn().mockReturnValue({
                    addSelect: jest.fn().mockReturnValue({
                      addSelect: jest.fn().mockReturnValue({
                        where: jest.fn().mockReturnValue({
                          limit: jest.fn().mockReturnValue({
                            offset: jest.fn().mockReturnValue({
                              getRawMany: jest.fn().mockResolvedValue([]),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    } as unknown as DataSource;
    const service = new PaymentService(txRepo, dataSource);

    const payments = await service.getPaymentsFromPayer();

    expect(payments).toBeDefined();
  });

  it('should return payments due provider', async () => {
    const txRepo: Repository<Transaction> = {} as Repository<Transaction>;
    const dataSource: DataSource = {
      createQueryBuilder: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          leftJoin: jest.fn().mockReturnValue({
            addSelect: jest.fn().mockReturnValue({
              addSelect: jest.fn().mockReturnValue({
                addSelect: jest.fn().mockReturnValue({
                  addSelect: jest.fn().mockReturnValue({
                    addSelect: jest.fn().mockReturnValue({
                      addSelect: jest.fn().mockReturnValue({
                        addSelect: jest.fn().mockReturnValue({
                          addSelect: jest.fn().mockReturnValue({
                            where: jest.fn().mockReturnValue({
                              andWhere: jest.fn().mockReturnValue({
                                limit: jest.fn().mockReturnValue({
                                  offset: jest.fn().mockReturnValue({
                                    getRawMany: jest.fn().mockResolvedValue([]),
                                  }),
                                }),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    } as unknown as DataSource;
    const service = new PaymentService(txRepo, dataSource);

    const payments = await service.getPaymentsDueProvider();

    expect(payments).toBeDefined();
  });
});
