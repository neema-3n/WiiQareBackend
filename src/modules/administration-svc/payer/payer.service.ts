import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoucherStatus } from 'src/common/constants/enums';
import { Payer } from 'src/modules/payer-svc/entities/payer.entity';
import { User } from 'src/modules/session/entities/user.entity';
import { Transaction } from 'src/modules/smart-contract/entities/transaction.entity';
import { Repository } from 'typeorm';
import { PayerListDto } from './dto/payers.dto';

const lookup = require('country-code-lookup');

@Injectable()
export class PayerService {
  constructor(
    @InjectRepository(Payer)
    private PayerRepository: Repository<Payer>,

    @InjectRepository(Transaction)
    private TransactionRepository: Repository<Transaction>,

    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}
  /**
   * This method is used to get global summary of payers related vouchers information
   * @returns
   */
  async getSummary() {
    const numberOfRegisteredPayers = await this.PayerRepository.count();

    const totalNumberOfPurchasedVouchers =
      await this.TransactionRepository.count();

    const totalNumberOfPendingVouchers = await this.TransactionRepository.count(
      {
        where: {
          status: VoucherStatus.PENDING,
        },
      },
    );

    const totalNumberOfRedeemedVouchers =
      await this.TransactionRepository.count({
        where: {
          status: VoucherStatus.CLAIMED,
        },
      });

    // TODO : use date-fns to get active payers dates from the last 6months
    const numberOfActivePayers = 0;

    return {
      numberOfRegisteredPayers,
      totalNumberOfPurchasedVouchers,
      totalNumberOfPendingVouchers,
      totalNumberOfRedeemedVouchers,
      numberOfActivePayers,
    };
  }

  //TODO :  \payers\id
  findPayer(id) {
    return `Payer with id : ${id}`;
  }

  /**
   * This method is used to get all recap of all payers like name, country, all beneficiaries of every payer, etc
   * @returns
   */
  async findAllPayers(): Promise<PayerListDto[]> {
    // First request and get id, name, 
    const payerTotalBeneficiaries: any = await this.TransactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndMapMany(
        'transaction.sender',
        Payer,
        'payer',
        'payer.user = transaction.senderId',
      )
      .groupBy("payer.id")
      .select('payer.id', 'id')
      .addSelect('payer.lastName', 'lastName')
      .addSelect('payer.country', 'countryISO2')
      .addSelect('payer.createdAt', 'createdAt')
      .addSelect("COUNT(DISTINCT(voucher->>'patientId'))", "totalBeneficiaries")
      .addSelect("COUNT(*)", "totalPurchasedVouchers")
      .getRawMany();

    
    const payerTotalUnspentVouchers: any = await this.TransactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndMapMany(
        'transaction.sender',
        Payer,
        'payer',
        'payer.user = transaction.senderId',
      )
      .select("payer.id", "id")
      .groupBy("payer.id")
      .addSelect("COUNT(*)", "totalUnspentVouchers")
      .where("(transaction.ownerType = 'PATIENT' AND transaction.status = 'UNCLAIMED')")
      .getRawMany();

      const payerTotalOpenVouchers: any = await this.TransactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndMapMany(
        'transaction.sender',
        Payer,
        'payer',
        'payer.user = transaction.senderId',
      )
      .select("payer.id", "id")
      .groupBy("payer.id")
      .addSelect("COUNT(*)", "totalOpenVouchers")
      .where("(transaction.ownerType = 'PROVIDER' AND transaction.status = 'UNCLAIMED')")
      .getRawMany();
      
      const payerTotalRedeemedVouchers: any = await this.TransactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndMapMany(
        'transaction.sender',
        Payer,
        'payer',
        'payer.user = transaction.senderId',
      )
      .select("payer.id", "id")
      .groupBy("payer.id")
      .addSelect("COUNT(*)", "totalRedeemedVouchers")
      .where("(transaction.ownerType = 'PROVIDER' AND transaction.status = 'PENDING')")
      .getRawMany();

    const payers = []; 
    for (var _i = 0; _i < payerTotalBeneficiaries.length; _i++) {
      payers.push({
        'payerId': payerTotalBeneficiaries[_i].id, 
        'payerName': payerTotalBeneficiaries[_i].lastName,
        'registeredDate': new Date(payerTotalBeneficiaries[_i].createdAt).toLocaleDateString(),
        'payerCountry': lookup.byFips(payerTotalBeneficiaries[_i].countryISO2).country,
        'beneficiaries': payerTotalBeneficiaries[_i].totalBeneficiaries,
        'purchasedVouchers': payerTotalBeneficiaries[_i].totalPurchasedVouchers,
        'unspentVouchers': this.getTotal(payerTotalUnspentVouchers, payerTotalBeneficiaries[_i].id, "totalUnspentVouchers"),
        'openVouchers': this.getTotal(payerTotalOpenVouchers, payerTotalBeneficiaries[_i].id, "totalOpenVouchers"),
        'redeemedVouchers': this.getTotal(payerTotalRedeemedVouchers, payerTotalBeneficiaries[_i].id, "totalRedeemedVouchers")
      });
    }
    return payers as PayerListDto[];
  }

  
  getTotal(totalObjet : [], _id: string, _key : string): number {
      for(var total of totalObjet){
       if (total["id"] === _id)
         return total[_key];
     }
     return 0;
   } 
}
 