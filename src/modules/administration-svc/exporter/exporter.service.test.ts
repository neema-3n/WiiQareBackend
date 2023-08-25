import { DataSource } from 'typeorm';
import { ExporterService } from './exporter.service';
import * as BeneficiaryQueryBuilder from '../beneficiary/querybuilders/getAllbeneficiary.qb';
import * as PayerQueryBuilder from '../payer/querybuilders/getAllPayers.qb';
import * as ProvidersQueryBuilder from '../provider/querybuilders/getAllProviders.qb';
import * as VouchersQueryBuilder from '../voucher/querybuilders/getAllVouchers.qb';
import * as PayerPaymentsQueryBuilder from '../payment/querybuilders/getPaymentsFromPayer.qb';
import * as ProviderPaymentQueryBuilder from '../payment/querybuilders/getPaymentsDueProvider.qb';

describe('ExporterService', () => {
  let service: ExporterService;
  beforeEach(() => {
    jest.resetAllMocks();
    const dataSource: DataSource = {} as DataSource;
    service = new ExporterService(dataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQueryBuilder', () => {
    it('should return a query builder for Beneficiaries', () => {
      jest
        .spyOn(BeneficiaryQueryBuilder, 'getAllBeneficiariesQueryBuilder')
        .mockReturnValue({
          orderBy: jest.fn().mockReturnValue({}) as any,
        } as any);
      const qb = service['getQueryBuilder']('beneficiaries');

      expect(qb).toBeDefined();
    });

    it('should return a query builder for Payers', () => {
      jest
        .spyOn(PayerQueryBuilder, 'getAllPayersQueryBuilder')
        .mockReturnValue({
          orderBy: jest.fn().mockReturnValue({}) as any,
        } as any);
      const qb = service['getQueryBuilder']('payers');

      expect(qb).toBeDefined();
    });

    it('should return a query builder for Providers', () => {
      jest
        .spyOn(ProvidersQueryBuilder, 'getAllProvidersQueryBuilder')
        .mockReturnValue({
          orderBy: jest.fn().mockReturnValue({}) as any,
        } as any);
      const qb = service['getQueryBuilder']('providers');

      expect(qb).toBeDefined();
    });

    it('should return a query builder for Vouchers', () => {
      jest
        .spyOn(VouchersQueryBuilder, 'getAllVouchersQueryBuilder')
        .mockReturnValue({
          orderBy: jest.fn().mockReturnValue({}) as any,
        } as any);
      const qb = service['getQueryBuilder']('vouchers');

      expect(qb).toBeDefined();
    });

    it('should return a query builder for Payer Payments', () => {
      jest
        .spyOn(PayerPaymentsQueryBuilder, 'getAllPayerPaymentsQueryBuilder')
        .mockReturnValue({
          orderBy: jest.fn().mockReturnValue({}) as any,
        } as any);
      const qb = service['getQueryBuilder']('payer_payments');

      expect(qb).toBeDefined();
    });

    it('should return a query builder for Provider Payments', () => {
      jest
        .spyOn(ProviderPaymentQueryBuilder, 'getAllProviderPaymentQueryBuilder')
        .mockReturnValue({
          orderBy: jest.fn().mockReturnValue({}) as any,
        } as any);
      const qb = service['getQueryBuilder']('provider_payments');

      expect(qb).toBeDefined();
    });

    it('should return undefined if pageName is invalid', () => {
      const qb = service['getQueryBuilder']('invalid');

      expect(qb).toBeUndefined();
    });
  });

  describe('getFields', () => {
    it('should return fields for Beneficiaries', () => {
      const fields = service['getFields']('beneficiaries');
      expect(fields).toBeDefined();
    });

    it('should return fields for Payers', () => {
      const fields = service['getFields']('payers');
      expect(fields).toBeDefined();
    });

    it('should return fields for Providers', () => {
      const fields = service['getFields']('providers');
      expect(fields).toBeDefined();
    });

    it('should return fields for Vouchers', () => {
      const fields = service['getFields']('vouchers');
      expect(fields).toBeDefined();
    });

    it('should return fields for Payer Payments', () => {
      const fields = service['getFields']('payer_payments');
      expect(fields).toBeDefined();
    });

    it('should return fields for Provider Payments', () => {
      const fields = service['getFields']('provider_payments');
      expect(fields).toBeDefined();
    });

    it('should return undefined if pageName is invalid', () => {
      const fields = service['getFields']('invalid');
      expect(fields).toBeUndefined();
    });
  });
});
