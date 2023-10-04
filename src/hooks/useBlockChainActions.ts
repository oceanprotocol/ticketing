import { ethers } from 'ethers';
import {
  approve,
  Asset,
  Datatoken,
  FixedRateExchange,
  ProviderFees,
  ProviderInstance,
  Service,
} from '@oceanprotocol/lib';
import { useCallback, useState } from 'react';

import { oceanConfig } from '../ocean';
import type { RpcRequestParams } from '../types/methods';

export function useBlockChainActions() {
  const [loading, setLoading] = useState(false);

  const buyDataToken = useCallback(async ({ web3Provider, dataTokenAddress }: RpcRequestParams) => {
    const signer = web3Provider?.getSigner();
    if (!signer) {
      return;
    }

    const address = await web3Provider?.getSigner().getAddress();
    if (!address) {
      return;
    }

    const dataTokenAmount = '1';
    if (!oceanConfig?.fixedRateExchangeAddress || !oceanConfig?.oceanTokenAddress) {
      return;
    }

    const fixedRateExchange = new FixedRateExchange(oceanConfig?.fixedRateExchangeAddress, signer);
    const exchangeId = await fixedRateExchange.generateExchangeId(oceanConfig?.oceanTokenAddress, dataTokenAddress);

    const priceInfo = await fixedRateExchange.calcBaseInGivenDatatokensOut(exchangeId, dataTokenAmount);
    const oceanAmount = priceInfo.baseTokenAmount;

    const approveResult = await approve(
      signer,
      oceanConfig,
      address,
      oceanConfig.oceanTokenAddress!,
      oceanConfig.fixedRateExchangeAddress!,
      oceanAmount,
    );
    if (!approveResult) {
      throw new Error('Approve contract failed');
    }

    /**
     * approveResult can be:
     * - transaction response, in which case we need to wait for the transaction to be executed
     * - a number, which means no transaction was published because there is already an approval for the amount requested
     */
    if (typeof approveResult !== 'number') {
      await approveResult.wait(1);
    }

    const buyTx = await fixedRateExchange.buyDatatokens(exchangeId, dataTokenAmount, oceanAmount);
    if (!buyTx) {
      throw new Error('Buy data token failed');
    }

    await buyTx.wait(1);
  }, []);

  const createOrder = useCallback(
    async (
      web3Provider: ethers.providers.Web3Provider,
      dataTokenAddress: string,
      dataTokenService: Service,
      asset: Asset,
    ) => {
      const signer = web3Provider?.getSigner();
      const address = await web3Provider?.getSigner().getAddress();
      if (!address || !signer) {
        return;
      }

      const initializeData = await ProviderInstance.initialize(
        asset?.id!,
        dataTokenService?.id!,
        0,
        address,
        dataTokenService?.serviceEndpoint!,
      );

      const providerFees: ProviderFees = {
        providerFeeAddress: initializeData.providerFee.providerFeeAddress,
        providerFeeToken: initializeData.providerFee.providerFeeToken,
        providerFeeAmount: initializeData.providerFee?.providerFeeAmount,
        v: initializeData.providerFee.v,
        r: initializeData.providerFee.r,
        s: initializeData.providerFee.s,
        providerData: initializeData.providerFee.providerData,
        validUntil: initializeData.providerFee.validUntil,
      };

      const dataTokenInstance = new Datatoken(signer);

      const tx = await dataTokenInstance.startOrder(dataTokenAddress, address, 0, providerFees);
      if (!tx) {
        throw new Error('Create order failed');
      }

      await tx.wait(1);
    },
    [],
  );

  return {
    loading,
    buyDataToken,
    createOrder,
  };
}
