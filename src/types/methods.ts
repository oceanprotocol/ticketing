import type { ethers } from 'ethers';

export interface AccountAction {
  dataToken: string;
  title: string;
  callback: (web3Provider?: ethers.providers.Web3Provider) => Promise<any>;
}

export interface RpcRequestParams {
  web3Provider: ethers.providers.Web3Provider;
  dataTokenAddress: string;
}
