import { Inject, Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config.service';
import { logError, logInfo } from 'src/helpers/common.helper';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import abi from './abi/abi.json';

@Injectable()
export class SmartContractService {
  private web3: Web3;
  private readonly wiiqareContract: Contract;

  constructor(
    private readonly appConfigService: AppConfigService,
    @Inject('WEB3') web3: Web3,
  ) {
    this.web3 = web3;
    const abiItem: AbiItem = abi.abi as unknown as AbiItem;
    this.wiiqareContract = new this.web3.eth.Contract(
      abiItem,
      '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    );
  }

  /**
   * This function is used to create a new voucher
   */
  async mintVoucher() {
    try {
      const accounts = await this.web3.eth.getAccounts();

      logInfo(`accounts -> ${accounts}`);

      const response = await this.wiiqareContract.methods
        .mintVoucher([
          200,
          'USD',
          'ownerDemo',
          'hospitalDemo',
          'pacientDemo',
          'notClaimed',
        ])
        .send({ from: accounts[0] });
      logInfo(`response -> ${response}`);

      return response;
    } catch (err) {
      logError(`Error in mintVoucher: ${err}`);
    }
  }

  /**
   * This function is used to get voucher information
   *
   * @param voucherId
   */
  async getVoucher() {
    try {
      const accounts = await this.web3.eth.getAccounts();
      const response = await this.wiiqareContract.methods
        .vouchers(1)
        .call({ from: accounts[0] });

      //   logInfo(`response -> ${response}`);

      return response;
    } catch (err) {
      logError(`Error in getVoucher: ${err}`);
    }
  }
}
