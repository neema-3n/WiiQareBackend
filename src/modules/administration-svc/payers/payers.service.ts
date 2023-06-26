import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {VoucherStatus} from 'src/common/constants/enums';
import {Payer} from 'src/modules/payer-svc/entities/payer.entity';
import {User} from 'src/modules/session/entities/user.entity';
import {Transaction} from 'src/modules/smart-contract/entities/transaction.entity';
import {Repository} from 'typeorm';

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
      numberOfActivePayers
    };
  }


 //TODO :  \payers\id
  findPayer(id){
    return `Payer with id : ${id}`;
  }


  //TODO  \payers
  findAllPayers(){
    return 'list of all payers';
  }
}
