import { Asset, AssetDatatoken, Service } from '@oceanprotocol/lib';
import React, {
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useWalletContext } from './WalletContext';
import { getAccessDetails } from '../hooks/useGetAccessDetails';
import { ASSET_DID, aquarius } from '../ocean';
import { EventType, EventsData } from '../constants/EventsData';
import config from '../../config';
import { fetchData } from '../utils/fetch';
import { Prices } from '../types/Prices';
import { initialData } from '../constants/PricesInitialData';

type AssetContextType = {
  dataToken: AssetDatatoken | undefined;
  dataTokenService: Service | undefined;
  eventId: string;
  setEventId: React.Dispatch<React.SetStateAction<string>>;
  localEvent: EventType | undefined;
  asset: Asset | undefined;
  setAsset: React.Dispatch<React.SetStateAction<Asset | undefined>>;
  isVerifyingAccess: boolean;
  setIsVerifyingAccess: React.Dispatch<React.SetStateAction<boolean>>;
  refreshAssetData: string;
  setRefreshAssetData: React.Dispatch<React.SetStateAction<string>>;
  tokenAccessDetails: AccessDetails[];
  servicesWithAccess: AccessDetails[];
  setTokenAccessDetails: React.Dispatch<React.SetStateAction<AccessDetails[]>>;
  verifyAccess: () => Promise<AccessDetails[] | undefined>;
  price: string;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  handleTotalValueChange: (value: string) => void;
  prices: Prices;
  totalUnlockedAssets: number;
  totalSpentOnAssets: number;
  hasAccess: (index: number) => boolean;
  getServicePrice: (index: number) => string | undefined;
};

export const AssetContext = createContext<AssetContextType>({} as AssetContextType);

export function AssetContextProvider({ children }: { children: ReactNode }): ReactElement {
  const { web3Provider } = useWalletContext();
  const [eventId, setEventId] = useState<string>('');
  const [asset, setAsset] = useState<Asset>();
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(false);
  const [refreshAssetData, setRefreshAssetData] = useState('32');
  const [tokenAccessDetails, setTokenAccessDetails] = useState<AccessDetails[]>([]);
  const [price, setPrice] = useState('0');
  const [url, setUrl] = useState<string>();
  const [prices, setPrices] = useState<Prices>(initialData);

  const handleTotalValueChange = useCallback((value: string) => {
    setPrice(value);
  }, []);

  const localEvent = useMemo(() => {
    if (!eventId) {
      return;
    }
    return EventsData.find((event) => event.id === parseInt(eventId, 10));
  }, [eventId]);

  const initAsset = useCallback(async () => {
    const data = await aquarius.resolve(ASSET_DID);
    if (data) {
      setAsset(data);
    }
  }, []);

  const dataToken = useMemo(() => {
    if (!asset || !eventId) {
      return;
    }

    return asset.datatokens[parseInt(eventId, 10) - 1];
  }, [asset, eventId]);

  const dataTokenService = useMemo(() => {
    if (!asset) {
      return;
    }

    return asset.services.find((current) => current.datatokenAddress === dataToken?.address);
  }, [asset, dataToken?.address]);

  const getPrice = useCallback(async () => {
    if (!url) return;
    const priceData = await fetchData(url);
    if (!priceData) return;
    setPrices(priceData);
  }, [url]);

  useEffect(() => {
    if (!config.oceanApp) return;

    const currencies = config.oceanApp.currencies.join(',');
    const tokenIds = config.oceanApp.coingeckoTokenIds.join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=${currencies}`;
    setUrl(url);
  }, []);

  useEffect(() => {
    if (!url) return;
    getPrice();
  }, [getPrice, url]);

  const verifyAccess = useCallback(async () => {
    if (!asset) {
      return;
    }
    const walletAddress = await web3Provider?.getSigner().getAddress();
    if (!walletAddress) return;
    setIsVerifyingAccess(true);
    const serviceAssetData = [];
    for (let index = 0; index < asset?.services.length; index += 1) {
      serviceAssetData.push(
        getAccessDetails(
          asset.chainId,
          asset.services[index]?.datatokenAddress!,
          asset.services[index]?.timeout,
          walletAddress,
        ),
      );
    }
    const accessData = (await Promise.all(serviceAssetData)) as AccessDetails[];

    setTokenAccessDetails(accessData);
    setIsVerifyingAccess(false);
    return accessData;
  }, [asset, web3Provider]);

  const servicesWithAccess = useMemo(() => {
    return tokenAccessDetails.filter((asset) => asset?.validOrderTx);
  }, [tokenAccessDetails]);

  const hasAccess = useCallback(
    (index: number): boolean => {
      if (!(tokenAccessDetails && tokenAccessDetails[index]?.validOrderTx)) {
        return false;
      }
      return true;
    },
    [tokenAccessDetails],
  );

  const getServicePrice = useCallback(
    (index: number) => {
      return tokenAccessDetails && tokenAccessDetails[index]?.price;
    },
    [tokenAccessDetails],
  );

  const unlockedAssetsArray = useMemo(() => {
    return tokenAccessDetails.filter((item) => item?.validOrderTx && item?.validOrderTx.length > 0);
  }, [tokenAccessDetails]);

  const totalUnlockedAssets = useMemo(() => {
    return unlockedAssetsArray.length;
  }, [unlockedAssetsArray.length]);

  const totalSpentOnAssets = useMemo(() => {
    const priceArray: string[] = [];
    let totalSpent = 0;

    for (let index = 0; index < unlockedAssetsArray.length; index += 1) {
      priceArray.push(tokenAccessDetails[index]?.price || '');
    }

    for (let index = 0; index < priceArray.length; index += 1) {
      totalSpent += parseInt(priceArray[index] || '0', 10);
    }

    return totalSpent;
  }, [tokenAccessDetails, unlockedAssetsArray.length]);

  useEffect(() => {
    initAsset();
  }, [initAsset, refreshAssetData]);
  useEffect(() => {
    verifyAccess();
  }, [asset, verifyAccess, refreshAssetData]);

  const value: AssetContextType = useMemo(
    () => ({
      eventId,
      setEventId,
      localEvent,
      asset,
      setAsset,
      isVerifyingAccess,
      setIsVerifyingAccess,
      tokenAccessDetails,
      servicesWithAccess,
      setTokenAccessDetails,
      verifyAccess,
      dataToken,
      dataTokenService,
      price,
      setPrice,
      handleTotalValueChange,
      refreshAssetData,
      setRefreshAssetData,
      prices,
      totalUnlockedAssets,
      totalSpentOnAssets,
      hasAccess,
      getServicePrice,
    }),
    [
      eventId,
      localEvent,
      asset,
      isVerifyingAccess,
      tokenAccessDetails,
      servicesWithAccess,
      verifyAccess,
      dataToken,
      dataTokenService,
      price,
      handleTotalValueChange,
      refreshAssetData,
      prices,
      totalUnlockedAssets,
      totalSpentOnAssets,
      hasAccess,
      getServicePrice,
    ],
  );

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
}

export const useAssetContext = (): AssetContextType => {
  return useContext(AssetContext);
};
