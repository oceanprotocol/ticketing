import { useCallback, useMemo, useState } from 'react';
import { Datatoken, FixedRateExchange, ProviderFees, ProviderInstance, approve } from '@oceanprotocol/lib';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WalletConnectModal } from '@walletconnect/modal-react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import WalletSVG from '../../../assets/ph_wallet-light.svg';
import UnlockSVG from '../../../assets/clarity_unlock-line.svg';
import { providerMetadata, sessionParams, PROJECT_ID } from '../../wallet-connect';
import magic from '../../magic';
import { useWalletContext } from '../../context/WalletContext';
import { WalletConnectionMethodEnum } from '../../consts/wallet-connection-method-enum';
import { oceanConfig } from '../../ocean';
import { useAssetContext } from '../../context/AssetContext';
import TransactionDetails from '../../components/TransactionDetails';
import BigNumber from 'bignumber.js';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
SplashScreen.preventAutoHideAsync();

export default function Checkout() {
  const [fontsLoaded, fontError] = useFonts({
    'Kanit-Regular': require('../../../assets/fonts/Kanit-Regular.ttf'),
    'Kanit-Medium': require('../../../assets/fonts/Kanit-Medium.ttf'),
    'Kanit-Bold': require('../../../assets/fonts/Kanit-Bold.ttf'),
    'Kanit-ExtraBold': require('../../../assets/fonts/Kanit-ExtraBold.ttf'),
    'OpenSans-Regular': require('../../../assets/fonts/OpenSans-Regular.ttf'),
  });

  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { isConnected, onConnect, web3Provider, networkTokenBalanceFormatted, oceanTokenBalanceFormatted } =
    useWalletContext();
  const {
    asset,
    eventId,
    localEvent,
    tokenAccessDetails,
    setRefreshAssetData,
    verifyAccess,
    hasAccess,
    getServicePrice,
  } = useAssetContext();

  const [loading, setLoading] = useState(false);

  const alreadyOwned = useMemo(() => {
    return hasAccess(parseInt(eventId, 10) - 1);
  }, [eventId, hasAccess]);
  const hasSufficientFunds = useMemo(() => {
    const assetPrice = getServicePrice(parseInt(eventId, 10) - 1);
    if (!assetPrice) {
      return false;
    }
    const hasNetworkTokens = new BigNumber(networkTokenBalanceFormatted).isGreaterThanOrEqualTo(new BigNumber(0.001));
    const hasOceanTokens = new BigNumber(oceanTokenBalanceFormatted).isGreaterThanOrEqualTo(new BigNumber(assetPrice));

    return hasNetworkTokens && hasOceanTokens;
  }, [eventId, getServicePrice, networkTokenBalanceFormatted, oceanTokenBalanceFormatted]);
  const isAccessible = useMemo(() => {
    return !alreadyOwned && hasSufficientFunds;
  }, [alreadyOwned, hasSufficientFunds]);

  const dataToken = useMemo(() => {
    if (!asset) {
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

  const buyDataToken = useCallback(async () => {
    const signer = web3Provider?.getSigner();
    if (!signer) {
      return;
    }
    const address = await web3Provider?.getSigner().getAddress();
    if (!address) {
      return;
    }

    const dataTokenAmount = '1';
    if (!oceanConfig?.fixedRateExchangeAddress || !oceanConfig?.oceanTokenAddress || !dataToken?.address) {
      return;
    }

    const fixedRateExchange = new FixedRateExchange(oceanConfig?.fixedRateExchangeAddress!, signer);
    const exchangeId = await fixedRateExchange.generateExchangeId(oceanConfig?.oceanTokenAddress!, dataToken?.address);

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
  }, [web3Provider, dataToken?.address]);

  const createOrder = useCallback(async () => {
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

    const tx = await dataTokenInstance.startOrder(dataToken?.address!, address, 0, providerFees);
    if (!tx) {
      throw new Error('Create order failed');
    }

    await tx.wait(1);
  }, [web3Provider, asset?.id, dataTokenService?.id, dataTokenService?.serviceEndpoint, dataToken?.address]);

  const onPressBuy = useCallback(async () => {
    setLoading(true);

    try {
      await buyDataToken();
      await createOrder();
      await verifyAccess();
      Alert.alert('Success', 'Service bought with success!');
      setRefreshAssetData(Math.random().toString());
      navigate('myAccount', { screen: 'ticket/[id]', params: { id: eventId } });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [buyDataToken, createOrder, eventId, navigate, setRefreshAssetData, verifyAccess]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ScrollView bounces={false} style={styles.container} onLayout={onLayoutRootView}>
      <ImageBackground
        source={require('../../../assets/image_welcome.jpg')}
        resizeMode="cover"
        style={styles.image}
        imageStyle={{
          resizeMode: 'cover',
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          top: 0,
        }}
      >
        <LinearGradient colors={['rgba(0, 0, 0, 0.80)', '#000']} style={styles.imageGradient}>
          <View style={styles.containerBox}>
            {!isConnected && <Text style={styles.eventTitle}>Login to Your Account</Text>}
            {isConnected ? (
              <View style={styles.box}>
                <TransactionDetails
                  service={localEvent?.service}
                  reservationCode={localEvent?.reservationCode}
                  price={tokenAccessDetails[parseInt(eventId, 10) - 1]?.price || ''}
                  symbol="OCEAN"
                />
                <View>
                  {!hasSufficientFunds && <Text style={styles.whiteText}>You don&apos;t have sufficient funds!</Text>}
                  {alreadyOwned && <Text style={styles.whiteText}>You already own this ticket!</Text>}
                  <View style={styles.centerRow}>
                    <TouchableOpacity
                      style={[
                        loading ? styles.buttonDisabled : [styles.buy, styles.textAlignCenter],
                        !isAccessible && styles.buttonDisabled,
                      ]}
                      onPress={() => onPressBuy()}
                      disabled={!isAccessible}
                    >
                      <Text style={[styles.buyText]}>
                        {loading ? (
                          <ActivityIndicator size="large" />
                        ) : (
                          <Text style={[styles.buyText, !isAccessible && styles.fontWhite]}>Confirm</Text>
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <>
                <TouchableOpacity style={styles.buy} onPress={() => onConnect(WalletConnectionMethodEnum.MagicLink)}>
                  <UnlockSVG width={24} height={24} />
                  <Text style={styles.buyText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buy}
                  onPress={() => {
                    onConnect(WalletConnectionMethodEnum.WalletConnect);
                  }}
                >
                  <WalletSVG width={24} height={24} />
                  <Text style={styles.buyText}>Connect with wallet</Text>
                </TouchableOpacity>
              </>
            )}
            <WalletConnectModal
              projectId={PROJECT_ID}
              providerMetadata={providerMetadata}
              sessionParams={sessionParams}
            />
          </View>
          <StatusBar style="light" />
          <magic.Relayer />
        </LinearGradient>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    minHeight: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  image: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  imageGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingBottom: 75,
  },
  containerBox: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: 30,
    paddingLeft: 24,
    paddingRight: 24,
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    paddingTop: 64,
    paddingBottom: 24,
  },
  centerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTitle: {
    color: '#F5F6F8',
    fontSize: 32,
    lineHeight: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Kanit-Medium',
  },
  font20Kanit: {
    color: '#F5F6F8',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: 'bold',
    fontFamily: 'Kanit-Medium',
  },
  font14: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    lineHeight: 19,
  },
  textGrey: {
    color: '#95989D',
  },
  textWhite: {
    color: '#F5F6F8',
  },
  textBold: {
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
  },
  buy: {
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 8,
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#F6B027',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: 48,
    paddingRight: 48,
    paddingBottom: 12,
    paddingTop: 12,
  },
  buyText: {
    color: '#21242C',
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginLeft: 12,
  },
  whiteText: {
    color: '#fff',
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  marginTop30: {
    marginTop: 30,
  },
  buttonDisabled: {
    opacity: 0.8,
    backgroundColor: '#333',
    color: '#fff',
  },
  transactionDetails: {
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 12,
    width: '100%',
    overflow: 'hidden',
  },
  transactionDetailsRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textAlignLeft: {
    textAlign: 'left',
  },
  textAlignCenter: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  marginTop24: {
    marginTop: 24,
  },
  fontWhite: {
    color: '#fff',
  },
});
