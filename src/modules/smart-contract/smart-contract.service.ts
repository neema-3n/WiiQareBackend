import { Inject, Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config.service';
import { logError, logInfo } from 'src/helpers/common.helper';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import abi from './abi/abi.json';
import { MintVoucherDto } from './dto/mint-voucher.dto';
import { VoucherStatus } from '../../common/constants/enums';
import { response } from 'express';

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
      this.appConfigService.smartContractAddress,
    );
  }

  /**
   * This function is used to mint a newer voucher NFT on blockchain.
   *  @param mintVoucherDto
   */
  async mintVoucher(mintVoucherDto: MintVoucherDto) {
    try {
      //NOTICE: starting we will be using the wiiQare account to mint the vouchers!
      const accounts = await this.web3.eth.getAccounts();

      logInfo(`accounts -> ${accounts}`);

      const { ownerId, amount, currency, patientId, description } =
        mintVoucherDto;

      const response = await this.wiiqareContract.methods
        .mintVoucher([
          amount,
          currency,
          ownerId,
          'hospitalDemo',
          patientId,
          VoucherStatus.UNCLAIMED,
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
  async getVoucherById(voucherId: string) {
    try {
      const accounts = await this.web3.eth.getAccounts();

      //   logInfo(`response -> ${response}`);

      return await this.wiiqareContract.methods
        .vouchers(voucherId)
        .call({ from: accounts[0] });
    } catch (err) {
      logError(`Error in getVoucher: ${err}`);
    }
  }

  /**
   * This function is used to get all vouchers from an account
   *
   * @param accountId
   */
  async getAllVouchers(accountId: string) {
    try {
      const accounts = await this.web3.eth.getAccounts();

      const response = await this.wiiqareContract.methods
        .getAllVouchers()
        .call({ from: accountId });

      //   logInfo(`response -> ${response}`);

      return response;
    } catch (err) {
      logError(`Error in getVoucher: ${err}`);
    }
  }

  /**
   * This function is used to make a voucher transfer
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
}
