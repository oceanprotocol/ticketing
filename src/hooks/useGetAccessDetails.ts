// @ts-nocheck
/* eslint-disable no-unsafe-optional-chaining */
import { Config, ConfigHelper, ProviderFees, ProviderInstance } from '@oceanprotocol/lib';
import Decimal from 'decimal.js';
import { OperationContext, OperationResult, TypedDocumentNode } from 'urql';
import Web3 from 'web3';
import { getFixedBuyPrice } from '../utils/fixedRateExchange';
import { tokenPriceQuery } from '../utils/tokenPriceQuery';
// import { getUrqlClientInstance } from '../context/UrqlProvider';
import { TokenPriceQuery, TokenPriceQueryToken, TokenPriceQueryTokenOrdersReuses } from '../types/TokenPriceQuery';
import config from '../../config';
import { client } from '../graphql';

function getAccessDetailsFromTokenPrice(tokenPrice: TokenPriceQueryToken, timeout?: number): AccessDetails | undefined {
  const accessDetails = {} as AccessDetails;

  // Return early when no supported pricing schema found.
  if (tokenPrice?.dispensers?.length === 0 && tokenPrice?.fixedRateExchanges?.length === 0) {
    accessDetails.type = 'NOT_SUPPORTED';
    return accessDetails;
  }
  if (tokenPrice?.orders?.length && tokenPrice?.orders?.length > 0) {
    const order = tokenPrice.orders[0];
    const providerFees: ProviderFees = order?.providerFee ? JSON.parse(order.providerFee) : null;
    accessDetails.validProviderFees =
      providerFees?.validUntil && Date.now() / 1000 < Number(providerFees?.validUntil) ? providerFees : undefined;
    // eslint-disable-next-line camelcase
    let reusedOrder: TokenPriceQueryTokenOrdersReuses | undefined = undefined;
    if (order?.reuses && order.reuses.length > 0) {
      reusedOrder = order.reuses[0];
    }
    // asset is owned if there is an order and asset has timeout 0 (forever) or if the condition is valid
    // eslint-disable-next-line no-unsafe-optional-chaining
    if (!order?.createdTimestamp || !timeout) {
      return;
    }
    accessDetails.isOwned = timeout === 0 || Date.now() / 1000 - order?.createdTimestamp < timeout;
    // the last valid order should be the last reuse order tx id if there is one
    accessDetails.validOrderTx = reusedOrder?.tx || order?.tx || '';
  }
  if (tokenPrice.templateId === null) {
    return;
  }
  accessDetails.templateId = tokenPrice?.templateId;
  // TODO: fetch order fee from sub query
  accessDetails.publisherMarketOrderFee = tokenPrice?.publishMarketFeeAmount;
  if (tokenPrice?.fixedRateExchanges[0] === null) {
    return;
  }

  const fixed = tokenPrice?.fixedRateExchanges[0]!;
  if (!fixed || !fixed.baseToken.name || !fixed.baseToken.symbol || !fixed.datatoken.name || !fixed.datatoken.symbol) {
    return;
  }
  accessDetails.type = 'fixed';
  accessDetails.addressOrId = fixed.exchangeId;
  accessDetails.price = fixed.price;
  // in theory we should check dt balance here, we can skip this because in the market we always create fre with minting capabilities.
  accessDetails.isPurchasable = fixed.active;
  accessDetails.baseToken = {
    address: fixed.baseToken.address,
    name: fixed.baseToken.name,
    symbol: fixed.baseToken.symbol,
    decimals: fixed.baseToken.decimals,
  };
  accessDetails.datatoken = {
    address: fixed.datatoken.address,
    name: fixed.datatoken.name,
    symbol: fixed.datatoken.symbol,
  };

  return accessDetails;
}

/**
 * This will be used to get price including fees before ordering
 * @param {AssetExtended} asset
 * @param {AccessDetails} accessDetails
 * @param {Web3} web3
 * @param {string} accountId
 * @param {number} serviceIndex
 * @param {ProviderFees} providerFees
 * @return {Promise<OrderPriceAndFees>}
 */
export async function getOrderPriceAndFees(
  asset: AssetExtended,
  accessDetails: AccessDetails,
  web3: Web3,
  accountId?: string,
  serviceIndex?: number,
  providerFees?: ProviderFees,
): Promise<OrderPriceAndFees | undefined> {
  const orderPriceAndFee = {
    price: String(accessDetails.price || '0'),
    publisherMarketOrderFee: config.oceanApp.publisherMarketOrderFee || '0',
    publisherMarketFixedSwapFee: '0',
    consumeMarketOrderFee: config.oceanApp.consumeMarketOrderFee || '0',
    consumeMarketFixedSwapFee: '0',
    providerFee: {
      providerFeeAmount: '0',
    },
    opcFee: '0',
  } as OrderPriceAndFees;

  if (!accountId || (!serviceIndex && asset?.services.length === 0)) {
    return;
  }

  // fetch provider fee
  const initializeData =
    !providerFees &&
    (await ProviderInstance.initialize(
      asset?.id,
      asset?.services[serviceIndex || 0].id,
      0,
      accountId,
      asset?.services[serviceIndex || 0].serviceEndpoint,
    ));
  orderPriceAndFee.providerFee = providerFees || initializeData.providerFee;

  // fetch price and swap fees
  if (accessDetails?.type === 'fixed') {
    const fixed = await getFixedBuyPrice(accessDetails, asset?.chainId, web3);
    orderPriceAndFee.price = fixed.baseTokenAmount;
    orderPriceAndFee.opcFee = fixed.oceanFeeAmount;
    orderPriceAndFee.publisherMarketFixedSwapFee = fixed.marketFeeAmount;
    orderPriceAndFee.consumeMarketFixedSwapFee = fixed.consumeMarketFeeAmount;
  }

  // calculate full price, we assume that all the values are in ocean, otherwise this will be incorrect
  orderPriceAndFee.price = new Decimal(+orderPriceAndFee.price || 0)
    .add(new Decimal(+orderPriceAndFee?.consumeMarketOrderFee || 0))
    .add(new Decimal(+orderPriceAndFee?.publisherMarketOrderFee || 0))
    .toString();

  // orderPriceAndFee.price = '100';

  return orderPriceAndFee;
}

export async function fetchData(query: TypedDocumentNode, variables: any, context: OperationContext): Promise<any> {
  try {
    return await client.query(query, variables, context).toPromise();
  } catch (error) {
    // eslint-disable-next-line
    console.log(error);
  }
  return null;
}

export function getOceanConfig(network: string | number): Config {
  const config = new ConfigHelper().getConfig(
    network,
    network === 'polygon' ||
      network === 'moonbeamalpha' ||
      network === 1287 ||
      network === 'bsc' ||
      network === 56 ||
      network === 'gaiaxtestnet' ||
      network === 2021000
      ? undefined
      : process.env.EXPO_PUBLIC_INFURA_PROJECT_ID,
  ) as Config;
  return config as Config;
}

export function getSubgraphUri(chainId: number): string {
  const config = getOceanConfig(chainId);
  return config.subgraphUri;
}

export function getQueryContext(chainId: number): OperationContext | undefined {
  try {
    if (!config.oceanApp.chainIdsSupported.includes(chainId)) {
      // eslint-disable-next-line no-console
      console.log(new Error('network not supported, query context cancelled'));
      return;
    }

    return {
      url: `${getSubgraphUri(Number(chainId))}/subgraphs/name/oceanprotocol/ocean-subgraph`,
      requestPolicy: 'network-only',
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

export async function getAccessDetails(
  chainId: number,
  datatokenAddress: string,
  timeout?: number,
  account = '',
): Promise<AccessDetails | undefined> {
  try {
    const queryContext = getQueryContext(Number(chainId));
    if (!queryContext) {
      return;
    }
    const tokenQueryResult: OperationResult<TokenPriceQuery, { datatokenId: string; account: string }> =
      await fetchData(
        tokenPriceQuery,
        {
          datatokenId: datatokenAddress.toLowerCase(),
          account: account?.toLowerCase(),
        },
        queryContext,
      );
    // eslint-disable-next-line camelcase
    if (!tokenQueryResult?.data?.token) {
      return;
    }

    const tokenPrice: TokenPriceQueryToken = tokenQueryResult?.data?.token;

    const accessDetails = getAccessDetailsFromTokenPrice(tokenPrice, timeout);
    return accessDetails;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
