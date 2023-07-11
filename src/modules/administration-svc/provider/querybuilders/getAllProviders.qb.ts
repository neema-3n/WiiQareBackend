import { subMonths, subWeeks } from 'date-fns';
import { Provider } from 'src/modules/provider-svc/entities/provider.entity';
import { Transaction } from 'src/modules/smart-contract/entities/transaction.entity';
import { DataSource, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

async function getProviderInfoQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Provider>> {
  return await dataSource
    .createQueryBuilder()
    .from(Provider, 'provider')
    .addSelect('provider.id::text', 'providerId')
    .addSelect('provider.name', 'name')
    .addSelect('provider.city', 'city')
    .addSelect("provider.contact_person->>'country'", 'country')
    .addSelect("to_char(provider.createdAt,'dd/mm/yyyy')", 'registrationDate');
}

async function getLastProviderToBeneficiaryTransactionDateQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Transaction>> {
  return await dataSource
    .createQueryBuilder()
    .from(Transaction, 'transaction')
    .leftJoin(Provider, 'provider', 'transaction.ownerId=provider.id')
    .addSelect('provider.id::text', 'providerId')
    .addSelect(
      `max(transaction.updatedAt)`,
      'lastBeneficiaryProviderTransaction',
    )
    .where("transaction.ownerType='PROVIDER'")
    .andWhere("transaction.status IN ('UNCLAIMED','CLAIMED','BURNED')")
    .andWhere("transaction.senderCurrency IN ('eur','EUR')")
    .groupBy(`"providerId"`);
}

async function getUniqueBeneficiaryCountPerProviderQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Transaction>> {
  return await dataSource
    .createQueryBuilder()
    .from(Transaction, 'transaction')
    .leftJoin(Provider, 'provider', 'transaction.ownerId=provider.id')
    .addSelect('provider.id::text', 'providerId')
    .addSelect(
      `COUNT(DISTINCT transaction.voucher->>'patientId')`,
      'UniqueBeneficiaryCount',
    )
    .where("transaction.ownerType='PROVIDER'")
    .andWhere("transaction.status IN ('UNCLAIMED','CLAIMED','BURNED')")
    .andWhere("transaction.senderCurrency IN ('eur','EUR')")
    .groupBy(`"providerId"`);
}

async function getTotalBeneficiaryProviderTransactionsWithinOneWeekQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Transaction>> {
  return await dataSource
    .createQueryBuilder()
    .from(Transaction, 'transaction')
    .leftJoin(Provider, 'provider', 'transaction.ownerId=provider.id')
    .addSelect('provider.id::text', 'providerId')
    .addSelect(
      'SUM(transaction.senderAmount)',
      'totalBeneficiaryProviderTransactionWithinOneWeek',
    )
    .where("transaction.ownerType='PROVIDER'")
    .andWhere("transaction.status IN ('UNCLAIMED','CLAIMED','BURNED')")
    .andWhere("transaction.senderCurrency IN ('eur','EUR')")
    .andWhere('transaction.updatedAt >= :datePrior', {
      datePrior: subWeeks(Date.now(), 1),
    })
    .groupBy(`"providerId"`);
}
async function getTotalBeneficiaryProviderTransactionsWithinOneMonthQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Transaction>> {
  return await dataSource
    .createQueryBuilder()
    .from(Transaction, 'transaction')
    .leftJoin(Provider, 'provider', 'transaction.ownerId=provider.id')
    .addSelect('provider.id::text', 'providerId')
    .addSelect(
      'SUM(transaction.senderAmount)',
      'totalBeneficiaryProviderTransactionWithinOneMonth',
    )
    .where("transaction.ownerType='PROVIDER'")
    .andWhere("transaction.status IN ('UNCLAIMED','CLAIMED','BURNED')")
    .andWhere("transaction.senderCurrency IN ('eur','EUR')")
    .andWhere('transaction.updatedAt >= :datePrior', {
      datePrior: subMonths(Date.now(), 1),
    })
    .groupBy(`"providerId"`);
}
async function getTotalBeneficiaryProviderTransactionsWithinThreeMonthQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Transaction>> {
  return await dataSource
    .createQueryBuilder()
    .from(Transaction, 'transaction')
    .leftJoin(Provider, 'provider', 'transaction.ownerId=provider.id')
    .addSelect('provider.id::text', 'providerId')
    .addSelect(
      'SUM(transaction.senderAmount)',
      'totalBeneficiaryProviderTransactionWithinThreeMonth',
    )
    .where("transaction.ownerType='PROVIDER'")
    .andWhere("transaction.status IN ('UNCLAIMED','CLAIMED','BURNED')")
    .andWhere("transaction.senderCurrency IN ('eur','EUR')")
    .andWhere('transaction.updatedAt >= :datePrior', {
      datePrior: subMonths(Date.now(), 3),
    })
    .groupBy(`"providerId"`);
}
async function getTotalBeneficiaryProviderTransactionsWithinSixMonthQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Transaction>> {
  return await dataSource
    .createQueryBuilder()
    .from(Transaction, 'transaction')
    .leftJoin(Provider, 'provider', 'transaction.ownerId=provider.id')
    .addSelect('provider.id::text', 'providerId')
    .addSelect(
      'SUM(transaction.senderAmount)',
      'totalBeneficiaryProviderTransactionWithinSixMonth',
    )
    .where("transaction.ownerType='PROVIDER'")
    .andWhere("transaction.status IN ('UNCLAIMED','CLAIMED','BURNED')")
    .andWhere("transaction.senderCurrency IN ('eur','EUR')")
    .andWhere('transaction.updatedAt >= :datePrior', {
      datePrior: subMonths(Date.now(), 6),
    })
    .groupBy(`"providerId"`);
}
async function getTotalBeneficiaryTransactionPerProviderQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Transaction>> {
  return await dataSource
    .createQueryBuilder()
    .from(Transaction, 'transaction')
    .leftJoin(Provider, 'provider', 'transaction.ownerId=provider.id')
    .addSelect('provider.id::text', 'providerId')
    .addSelect(
      'sum(transaction.senderAmount)',
      'totalBeneficiaryProviderTransaction',
    )
    .where("transaction.ownerType='PROVIDER'")
    .andWhere("transaction.status IN ('UNCLAIMED','CLAIMED','BURNED')")
    .andWhere("transaction.senderCurrency IN ('eur','EUR')")
    .groupBy(`"providerId"`);
}

async function getTotalValueAndCountOfReceivedVouchersPerProviderQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Transaction>> {
  return await dataSource
    .createQueryBuilder()
    .from(Transaction, 'transaction')
    .leftJoin(Provider, 'provider', 'transaction.ownerId=provider.id')
    .addSelect('provider.id::text', 'providerId')
    .addSelect(
      'COUNT(transaction.voucher)::integer',
      'totalNumberOfReceivedVouchers',
    )
    .addSelect('SUM(transaction.senderAmount)', 'totalAmountOfReceivedVouchers')
    .where("transaction.ownerType='PROVIDER'")
    .andWhere("transaction.status IN ('UNCLAIMED','CLAIMED','BURNED')")
    .andWhere("transaction.senderCurrency IN ('eur','EUR')")
    .groupBy(`"providerId"`);
}
async function getUnclaimedVouchersPerProviderQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Transaction>> {
  return await dataSource
    .createQueryBuilder()
    .from(Transaction, 'transaction')
    .leftJoin(Provider, 'provider', 'transaction.ownerId=provider.id')
    .addSelect('provider.id::text', 'providerId')
    .addSelect(
      'COUNT(transaction.voucher)::integer',
      'totalNumberOfUnclaimedVouchers',
    )
    .addSelect(
      'SUM(transaction.senderAmount)',
      'totalAmountOfUnclaimedVouchers',
    )
    .where("transaction.ownerType='PROVIDER'")
    .andWhere("transaction.status ='UNCLAIMED'")
    .andWhere("transaction.senderCurrency IN ('eur','EUR')")
    .groupBy(`"providerId"`);
}
async function getClaimedVouchersPerProviderQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Transaction>> {
  return await dataSource
    .createQueryBuilder()
    .from(Transaction, 'transaction')
    .leftJoin(Provider, 'provider', 'transaction.ownerId=provider.id')
    .addSelect('provider.id::text', 'providerId')
    .addSelect(
      'COUNT(transaction.voucher)::integer',
      'totalNumberOfClaimedVouchers',
    )
    .addSelect('SUM(transaction.senderAmount)', 'totalAmountOfClaimedVouchers')
    .where("transaction.ownerType='PROVIDER'")
    .andWhere("transaction.status = 'CLAIMED'")
    .andWhere("transaction.senderCurrency IN ('eur','EUR')")
    .groupBy(`"providerId"`);
}
async function getRedeemedVouchersPerProviderQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<Transaction>> {
  return await dataSource
    .createQueryBuilder()
    .from(Transaction, 'transaction')
    .leftJoin(Provider, 'provider', 'transaction.ownerId=provider.id')
    .addSelect('provider.id::text', 'providerId')
    .addSelect(
      'COUNT(transaction.voucher)::integer',
      'totalNumberOfRedeemedVouchers',
    )
    .addSelect('SUM(transaction.senderAmount)', 'totalAmountOfRedeemedVouchers')
    .where("transaction.ownerType='PROVIDER'")
    .andWhere("transaction.status ='BURNED'")
    .andWhere("transaction.senderCurrency IN ('eur','EUR')")
    .groupBy(`"providerId"`);
}

export async function getAllProvidersQueryBuilder(
  dataSource: DataSource,
): Promise<SelectQueryBuilder<ObjectLiteral>> {
  return await dataSource
    .createQueryBuilder()
    .addCommonTableExpression(
      await getProviderInfoQueryBuilder(dataSource),
      'ProviderTable',
    )
    .addCommonTableExpression(
      await getLastProviderToBeneficiaryTransactionDateQueryBuilder(dataSource),
      'providerBeneficiaryLastTransactionTable',
    )
    .addCommonTableExpression(
      await getUniqueBeneficiaryCountPerProviderQueryBuilder(dataSource),
      'uniqueBeneficiaryCountPerProviderTable',
    )
    .addCommonTableExpression(
      await getTotalBeneficiaryProviderTransactionsWithinOneWeekQueryBuilder(
        dataSource,
      ),
      'totalBeneficiaryProviderTransactionWithinOneWeekTable',
    )
    .addCommonTableExpression(
      await getTotalBeneficiaryProviderTransactionsWithinOneMonthQueryBuilder(
        dataSource,
      ),
      'totalBeneficiaryProviderTransactionWithinOneMonthTable',
    )
    .addCommonTableExpression(
      await getTotalBeneficiaryProviderTransactionsWithinThreeMonthQueryBuilder(
        dataSource,
      ),
      'totalBeneficiaryProviderTransactionWithinThreeMonthTable',
    )
    .addCommonTableExpression(
      await getTotalBeneficiaryProviderTransactionsWithinSixMonthQueryBuilder(
        dataSource,
      ),
      'totalBeneficiaryProviderTransactionWithinSixMonthTable',
    )
    .addCommonTableExpression(
      await getTotalBeneficiaryTransactionPerProviderQueryBuilder(dataSource),
      'totalBeneficiaryTransactionPerProviderTable',
    )
    .addCommonTableExpression(
      await getTotalValueAndCountOfReceivedVouchersPerProviderQueryBuilder(
        dataSource,
      ),
      'totalReceivedVouchersInfoTable',
    )
    .addCommonTableExpression(
      await getUnclaimedVouchersPerProviderQueryBuilder(dataSource),
      'unclaimedVouchersPerProviderTable',
    )
    .addCommonTableExpression(
      await getClaimedVouchersPerProviderQueryBuilder(dataSource),
      'claimedVouchersPerProviderTable',
    )
    .addCommonTableExpression(
      await getRedeemedVouchersPerProviderQueryBuilder(dataSource),
      'redeemedVouchersPerProviderTable',
    )
    .from('ProviderTable', 'p')
    .leftJoin(
      'providerBeneficiaryLastTransactionTable',
      'pblt',
      `"p"."providerId"="pblt"."providerId"`,
    )
    .leftJoin(
      'uniqueBeneficiaryCountPerProviderTable',
      'ubcp',
      `"ubcp"."providerId"="p"."providerId"`,
    )
    .leftJoin(
      'totalBeneficiaryProviderTransactionWithinOneWeekTable',
      'tbptw1',
      `"tbptw1"."providerId"="p"."providerId"`,
    )
    .leftJoin(
      'totalBeneficiaryProviderTransactionWithinOneMonthTable',
      'tbptw1m',
      `"tbptw1m"."providerId"="p"."providerId"`,
    )
    .leftJoin(
      'totalBeneficiaryProviderTransactionWithinThreeMonthTable',
      'tbptw3m',
      `"tbptw3m"."providerId"="p"."providerId"`,
    )
    .leftJoin(
      'totalBeneficiaryProviderTransactionWithinSixMonthTable',
      'tbptw6m',
      `"tbptw6m"."providerId"="p"."providerId"`,
    )
    .leftJoin(
      'totalBeneficiaryTransactionPerProviderTable',
      'tbtp',
      `"tbtp"."providerId"="p"."providerId"`,
    )
    .leftJoin(
      'totalReceivedVouchersInfoTable',
      'trv',
      `"trv"."providerId"="p"."providerId"`,
    )
    .leftJoin(
      'unclaimedVouchersPerProviderTable',
      'uvp',
      `"uvp"."providerId"="p"."providerId"`,
    )
    .leftJoin(
      'claimedVouchersPerProviderTable',
      'cvp',
      `"cvp"."providerId"="p"."providerId"`,
    )
    .leftJoin(
      'redeemedVouchersPerProviderTable',
      'rvp',
      `"rvp"."providerId"="p"."providerId"`,
    )
    .addSelect(`"p"."providerId"`, 'id')
    .addSelect(`"p"."name"`, 'name')
    .addSelect(`"p"."city"`, 'city')
    .addSelect(`"p"."country"`, 'country')
    .addSelect(`"p"."registrationDate"`, 'registrationDate')
    .addSelect(
      `to_char("pblt"."lastBeneficiaryProviderTransaction",'dd/mm/yyyy HH24:MI')`,
      'lastBeneficiaryProviderTransactionOn',
    )
    .addSelect(
      `"ubcp"."UniqueBeneficiaryCount"::integer`,
      'totalNumberOfUniqueBeneficiaries',
    )
    .addSelect(
      `"tbptw1"."totalBeneficiaryProviderTransactionWithinOneWeek"`,
      'totalBeneficiaryProviderTransactionWithinOneWeek',
    )
    .addSelect(
      `"tbptw1m"."totalBeneficiaryProviderTransactionWithinOneMonth"`,
      'totalBeneficiaryProviderTransactionWithinOneMonth',
    )
    .addSelect(
      `"tbptw3m"."totalBeneficiaryProviderTransactionWithinThreeMonth"`,
      'totalBeneficiaryProviderTransactionWithinThreeMonths',
    )
    .addSelect(
      `"tbptw6m"."totalBeneficiaryProviderTransactionWithinSixMonth"`,
      'totalBeneficiaryProviderTransactionWithinSixMonths',
    )
    .addSelect(
      `"tbtp"."totalBeneficiaryProviderTransaction"`,
      'totalBeneficiaryProviderTransaction',
    )
    .addSelect(
      `"trv"."totalNumberOfReceivedVouchers"`,
      'totalNumberOfReceivedVouchers',
    )
    .addSelect(
      `"trv"."totalAmountOfReceivedVouchers"`,
      'totalAmountOfReceivedVouchers',
    )
    .addSelect(
      `"uvp"."totalNumberOfUnclaimedVouchers"`,
      'totalNumberOfUnclaimedVouchers',
    )
    .addSelect(
      `"uvp"."totalAmountOfUnclaimedVouchers"`,
      'totalAmountOfUnclaimedVouchers',
    )
    .addSelect(
      `"cvp"."totalNumberOfClaimedVouchers"`,
      'totalNumberOfClaimedVouchers',
    )
    .addSelect(
      `"cvp"."totalAmountOfClaimedVouchers"`,
      'totalAmountOfClaimedVouchers',
    )
    .addSelect(
      `"rvp"."totalNumberOfRedeemedVouchers"`,
      'totalNumberOfRedeemedVouchers',
    )
    .addSelect(
      `"rvp"."totalAmountOfRedeemedVouchers"`,
      'totalAmountOfRedeemedVouchers',
    );
}
