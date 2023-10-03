import React, { useCallback, useMemo } from 'react';

import config from '../../../config';
import NetworkEnum from '../../consts/NetworkEnum';

export default function useProfile() {
  const {
    explorer: { ethMainnet, ethSepolia, polygon, mumbai, binance },
  } = config;

  const ExplorerLinks = useMemo(
    () => [
      {
        id: 1,
        name: 'ETH',
        logo: require('../../../assets/eth.png'),
        href: NetworkEnum.sepolia ? ethSepolia : ethMainnet,
      },
      {
        id: 2,
        name: 'Polygon',
        logo: require('../../../assets/polygon.png'),
        href: NetworkEnum.mumbai ? mumbai : polygon,
      },
      {
        id: 3,
        name: 'BSC',
        logo: require('../../../assets/binance.png'),
        href: binance,
      },
    ],
    [binance, ethMainnet, ethSepolia, mumbai, polygon],
  );

  return { ExplorerLinks };
}
