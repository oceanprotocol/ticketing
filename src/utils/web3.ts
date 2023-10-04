import Web3 from 'web3';
import { oceanConfig } from '../ocean';

/**
 * returns a dummy web3 instance, only usable to get info from the chain
 * @param chainId
 * @returns Web3 instance
 */
export async function getDummyWeb3(chainId: number): Promise<Web3> {
  return new Web3(oceanConfig.nodeUri || '');
}
