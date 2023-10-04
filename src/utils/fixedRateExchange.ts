// @ts-nocheck
import { FixedRateExchange, PriceAndFees } from '@oceanprotocol/lib';
import Web3 from 'web3';
import { getDummyWeb3 } from './web3';
import config from '../../config';
import { oceanConfig } from '../ocean';

/**
 * This is used to calculate the price to buy one datatoken from a fixed rate exchange. You need to pass either a web3 object or a chainId. If you pass a chainId a dummy web3 object will be created
 * @param {AccessDetails} accessDetails
 * @param {number} chainId
 * @param {Web3?} web3
 * @return {Promise<PriceAndFees>}
 */
export async function getFixedBuyPrice(
  accessDetails: AccessDetails,
  chainId?: number,
  web3?: Web3,
): Promise<PriceAndFees | undefined> {
  if (!web3 || !chainId) {
    console.log("web3 and chainId can't be undefined at the same time!");
  }
  let newWeb3;

  if (!web3 && chainId !== undefined) {
    newWeb3 = await getDummyWeb3(chainId);
  }
  if (!web3 || !chainId) {
    return;
  }

  const fixed = new FixedRateExchange(oceanConfig?.fixedRateExchangeAddress || '', web3 || newWeb3);
  const estimatedPrice = await fixed.calcBaseInGivenDatatokensOut(
    accessDetails.addressOrId,
    '1',
    config.oceanApp.consumeMarketFixedSwapFee,
  );
  return estimatedPrice;
}
