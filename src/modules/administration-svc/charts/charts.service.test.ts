import { DataSource } from 'typeorm';
import { ChartsService } from './charts.service';
import * as PayersChartInfoQueryBuilder from './querybuilders/payersChart.qb';
import * as BeneficiariesChartInfoQueryBuilder from './querybuilders/beneficiariesChart.qb';

describe('ChartsService', () => {
  let service: ChartsService;
  beforeEach(() => {
    jest.resetAllMocks();
    const dataSource: DataSource = {} as DataSource;
    service = new ChartsService(dataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findPayersChartInfo', () => {
    jest
      .spyOn(PayersChartInfoQueryBuilder, 'getPayersChartInfoQueryBuilder')
      .mockReturnValue({
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      } as any);

    const info = service.findPayersChartInfo(1);
    expect(info).toBeDefined();
  });

  it('findBeneficiariesChartInfo', () => {
    jest
      .spyOn(
        BeneficiariesChartInfoQueryBuilder,
        'getBeneficiariesChartInfoQueryBuilder',
      )
      .mockReturnValue({
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      } as any);

    const info = service.findBeneficiariesChartInfo(1);
    expect(info).toBeDefined();
  });
});
