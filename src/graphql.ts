import { fetchExchange, Client, cacheExchange } from 'urql';
import { oceanConfig } from './ocean';

export const client = new Client({
  url: `${oceanConfig.subgraphUri}/subgraphs/name/oceanprotocol/ocean-subgraph`,
  exchanges: [cacheExchange, fetchExchange],
});
