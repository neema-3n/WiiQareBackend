import { Inject, Injectable } from '@nestjs/common';
import { AppConfigService } from '../../config/app-config.service';
import { logError, logInfo } from '../../helpers/common.helper';
import Web3 from 'web3';
import { Account, AddedAccount } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { VoucherStatus } from '../../common/constants/enums';
import abi from './abi/abi.json';
import { MintVoucherDto } from './dto/mint-voucher.dto';

@Injectable()
export class SmartContractService {
  private web3: Web3;
  private readonly wiiqareContract: Contract;
  private readonly wiiQareAccount: Account;

  constructor(
    private readonly appConfigService: AppConfigService,
    @Inject('WEB3') web3: Web3,
  ) {
    this.web3 = web3;
    const abiItem: AbiItem = abi.abi as unknown as AbiItem;
    this.wiiqareContract = new this.web3.eth.Contract(
      abiItem,
      this.appConfigService.smartContractAddress,
    );
    this.wiiQareAccount = this.web3.eth.accounts.privateKeyToAccount(
      this.appConfigService.smartContractPrivateKey,
    );
  }

  /***
   *  This function is used to get gas free from the network
   */
  // async getGasFees(): Promise<any> {
  //   // get gas fees from mumbai network
  //   //TODO: move it to .env
  //   return (await fetch('https://gasstation-mumbai.matic.today/v2')).json();
  // }

  /**
   * This function is used to mint a newer voucher NFT on blockchain.
   *  @param mintVoucherDto
   */
  async mintVoucher(mintVoucherDto: MintVoucherDto) {
    try {
      // const gasParams = await this.getGasFees();
      //NOTICE: starting we will be using the wiiQare account to mint the vouchers!

      const { ownerId, amount, currency, patientId } = mintVoucherDto;

      const rr = this.web3.eth.accounts.wallet.add(
        this.appConfigService.smartContractPrivateKey,
      );

      const response = await this.wiiqareContract.methods
        .mintVoucher([
          amount,
          currency,
          ownerId,
          'hospitalDemo',
          patientId,
          VoucherStatus.UNCLAIMED,
        ])
        .send({
          from: this.wiiQareAccount.address,
          gasPrice: '30000000000',
          gas: '3996000',
        });

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
  async getVoucherById(voucherId: string) {
    try {
      return await this.wiiqareContract.methods
        .vouchers(voucherId)
        .call({ from: this.wiiQareAccount.address });
    } catch (err) {
      logError(`Error in getVoucher: ${err}`);
    }
  }

  /**
   * This function is used to get all vouchers from an account
   *
   * @param ownerId
   */
  async getAllVouchers(ownerId: string) {
    try {
      // const accounts = await this.web3.eth.getAccounts();

      const response = await this.wiiqareContract.methods
        .getAllVouchers()
        .call({ from: this.wiiQareAccount.address });

      //   logInfo(`response -> ${response}`);

      return response;
    } catch (err) {
      logError(`Error in getVoucher: ${err}`);
    }
  }

  /**
   * This function is used to make a voucher transfer
   *  ** alterVoucher
   *
   * @param voucherId
   * @param ownerId
   */
  async transferVoucher(voucherId: string, ownerId: string) {
    try {
      const accounts = await this.web3.eth.getAccounts();

      const result = await this.wiiqareContract.methods
        .transferVoucher(voucherId, ownerId)
        .call({ from: accounts[0] });

      return result;
    } catch (err) {
      logError(`Error in getVoucher: ${err}`);
    }
  }

  /**
   * This function is used to make changes to the voucher
   *  ** alterVoucher
   *
   * @param voucherId
   * @param ownerId
   */
  async alterVoucher(voucherId: string, ownerId: string) {
    try {
      const rr: AddedAccount = this.web3.eth.accounts.wallet.add(
        this.appConfigService.smartContractPrivateKey,
      );

      const result = await this.wiiqareContract.methods
        .alterVoucher(voucherId, [
          1000,
          'RON',
          ownerId,
          'hospitalWii',
          'pacientDemo',
          VoucherStatus.UNCLAIMED,
        ])
        .call({
          from: this.wiiQareAccount.address,
          gasPrice: '30000000000',
          gas: '3996000',
        });

      return result;
    } catch (err) {
      logError(`Error in getVoucher: ${err}`);
    }
  }
}
