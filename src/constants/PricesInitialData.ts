import { Prices } from '../types/Prices';
import config from '../../config';

export const initialData: Prices = config.oceanApp.coingeckoTokenIds.map((tokenId) => ({
  [tokenId]: {
    eur: 0.0,
  },
}))[0];
