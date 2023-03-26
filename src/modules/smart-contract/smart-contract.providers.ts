import { Provider } from '@nestjs/common';
import Web3 from 'web3';

export const nodeProvider: Provider = {
  provide: 'WEB3',
  useValue: new Web3('http://127.0.0.1:8545'),
};
