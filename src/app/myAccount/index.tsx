import { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import CustomImageBackground from '../../components/CustomImageBackground';
import { useAssetContext } from '../../context/AssetContext';
import { useWalletContext } from '../../context/WalletContext';
import { WalletConnectionMethodEnum } from '../../consts/wallet-connection-method-enum';
import { WalletConnectModal } from '@walletconnect/modal-react-native';
import { Link } from 'expo-router';
import { PROJECT_ID, providerMetadata, sessionParams } from '../../wallet-connect';
import WalletSVG from '../../../assets/ph_wallet-light.svg';
import LogOutSVG from '../../../assets/ph_sign-out.svg';
import UnlockSVG from '../../../assets/clarity_unlock-line.svg';
import { EventsData } from '../../constants/EventsData';
import magic from '../../magic';
import { truncateWalletAddress } from '../../utils/truncateAddress';
import Copy from '../../components/Copy';
import ExternalLinkSVG from '../../../assets/external.svg';
import { ProfileSwitchEnum } from '../../consts/ProfileSwitchEnum';
import useAccount from './useAccount';
import PriceConversion from '../../components/PriceConversion';
import EventRow from '../../components/EventRow';
import { setStringAsync } from 'expo-clipboard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MyAccount() {
  const [fontsLoaded, fontError] = useFonts({
    'Kanit-Regular': require('../../../assets/fonts/Kanit-Regular.ttf'),
    'Kanit-Medium': require('../../../assets/fonts/Kanit-Medium.ttf'),
    'Kanit-ExtraBold': require('../../../assets/fonts/Kanit-ExtraBold.ttf'),
    'OpenSans-Regular': require('../../../assets/fonts/OpenSans-Regular.ttf'),
  });
  const {
    isConnected,
    onConnect,
    onDisconnect,
    manageWallet,
    connectionMethod,
    walletAddress,
    networkTokenBalanceFormatted,
    oceanTokenBalanceFormatted,
  } = useWalletContext();
  const { servicesWithAccess, isVerifyingAccess, totalSpentOnAssets, totalUnlockedAssets } = useAssetContext();
  const { ExplorerLinks } = useAccount();
  const [switchPosition, setSwitchPosition] = useState(ProfileSwitchEnum.TICKETS);

  const servicesWithAccessData = useMemo(() => {
    return EventsData.filter((event) =>
      servicesWithAccess.find((service) => service?.addressOrId === event?.dataToken),
    );
  }, [servicesWithAccess]);

  const onCopyClipboard = useCallback(async (value: string) => {
    setStringAsync(value);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <ScrollView bounces={false} style={styles.container} onLayout={onLayoutRootView}>
        <CustomImageBackground fullHeight>
          <View style={styles.containerBox}>
            <Text style={[styles.pageTitle, styles.marginBottom24]}>My Profile</Text>
            <View style={styles.switch}>
              <TouchableOpacity
                style={[styles.switchButton, switchPosition === ProfileSwitchEnum.TICKETS && styles.switchButtonActive]}
                onPress={() => setSwitchPosition(ProfileSwitchEnum.TICKETS)}
              >
                <Text style={[styles.font18Kanit, styles.colorGray, styles.textAlignCenter]}>Tickets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.switchButton, switchPosition === ProfileSwitchEnum.ACCOUNT && styles.switchButtonActive]}
                onPress={() => setSwitchPosition(ProfileSwitchEnum.ACCOUNT)}
              >
                <Text style={[styles.font18Kanit, styles.colorGray, styles.textAlignCenter]}>Account</Text>
              </TouchableOpacity>
            </View>
            {!isConnected && (
              <Text style={[styles.eventTitle, styles.marginTop24, styles.marginBottom24]}>Login to Your Account</Text>
            )}
            {isConnected ? (
              <>
                <>
                  {switchPosition === ProfileSwitchEnum.TICKETS && (
                    <>
                      {isVerifyingAccess ? (
                        <ActivityIndicator size="large" style={{ marginTop: 24 }} />
                      ) : (
                        <>
                          <Text style={[styles.textSubtitle, styles.marginTop24]}>Owned Tickets</Text>
                          {servicesWithAccessData.length === 0 && (
                            <Text style={[styles.artist, styles.marginTop24]}>You have no current tickets</Text>
                          )}
                          <View style={styles.ticketsSection}>
                            {servicesWithAccessData.map((event) => {
                              return <EventRow key={event.id} event={event} ticket />;
                            })}
                          </View>
                        </>
                      )}
                    </>
                  )}
                </>
                <>
                  {switchPosition === ProfileSwitchEnum.ACCOUNT && (
                    <>
                      <View style={styles.accountDetailsRow}>
                        <View style={styles.addressBox}>
                          <View style={styles.addressRow}>
                            <Text style={[styles.eventTitle, styles.marginRight8]}>
                              {truncateWalletAddress(walletAddress, 5)}
                            </Text>
                            <Copy string={walletAddress} />
                          </View>
                          <View style={styles.addressRow}>
                            {ExplorerLinks.map((link) => {
                              return (
                                <Link
                                  key={link.id}
                                  href={link.href + walletAddress}
                                  style={[styles.marginRight, styles.marginTop12]}
                                >
                                  <View style={styles.addressRow}>
                                    <Image source={link.logo} width={20} height={20}></Image>
                                    <Text style={[styles.font10Kanit, styles.marginRight8, styles.marginLeft8]}>
                                      {link.name}
                                    </Text>
                                    <ExternalLinkSVG width={8} height={8} />
                                  </View>
                                </Link>
                              );
                            })}
                          </View>
                        </View>
                      </View>
                      <View style={styles.accountDetailsRow}>
                        <View style={styles.detailsBox}>
                          <Text style={[styles.eventTitle]}>
                            <PriceConversion price={totalSpentOnAssets.toString()} symbol="OCEAN" />
                          </Text>
                          <Text style={styles.font14Gold}>Total Spent</Text>
                        </View>
                        <View style={styles.detailsBox}>
                          <Text style={[styles.eventTitle]}>{totalUnlockedAssets}</Text>
                          <Text style={styles.font14Gold}>Total Spent</Text>
                        </View>
                      </View>
                      <View style={styles.accountDetailsRow}>
                        <View style={styles.detailsBox}>
                          <Text style={[styles.eventTitle]}>{networkTokenBalanceFormatted}</Text>
                          <Text style={[styles.font14Gold, styles.mx30]}>Matic Balance</Text>
                        </View>
                        <View style={styles.detailsBox}>
                          <Text style={[styles.eventTitle]}>{oceanTokenBalanceFormatted}</Text>
                          <Text style={styles.font14Gold}>Ocean Balance</Text>
                        </View>
                      </View>
                      <View style={styles.accountDetailsRow}></View>
                    </>
                  )}
                </>
                <View style={styles.box}>
                  <View style={styles.marginBottom24}>
                    {connectionMethod === WalletConnectionMethodEnum.MagicLink && (
                      <TouchableOpacity style={[styles.buy, styles.textAlignCenter]} onPress={() => manageWallet()}>
                        <Text style={styles.buyText}>Details</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={[styles.buy, styles.textAlignCenter]} onPress={() => onDisconnect()}>
                      <Text style={[styles.buyText, styles.marginRight]}>Log out</Text>
                      <LogOutSVG width={24} height={24} />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
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
              onCopyClipboard={onCopyClipboard}
            />
            <StatusBar style="light" />
          </View>
        </CustomImageBackground>
      </ScrollView>
      <magic.Relayer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#3D1C1A',
    minHeight: SCREEN_HEIGHT,
  },
  image: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerBox: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    paddingTop: 64,
    paddingLeft: 24,
    paddingRight: 24,
  },
  contentBox: {
    overflow: 'visible',
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 21,
  },
  textOrange: {
    color: '#F6B027',
    fontSize: 42,
    lineHeight: 64,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Kanit-ExtraBold',
  },
  textSubtitle: {
    color: '#F5F6F8',
    fontFamily: 'Kanit-Medium',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: -0.2,
    lineHeight: 21,
  },
  box: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    paddingTop: 64,
    paddingBottom: 24,
  },
  pageTitle: {
    fontFamily: 'Kanit-Medium',
    fontSize: 24,
    lineHeight: 26,
    color: '#F5F6F8',
    textAlign: 'center',
  },
  eventTitle: {
    color: '#F5F6F8',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Kanit-Medium',
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
  marginRight: {
    marginRight: 12,
  },
  textAlignCenter: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  accountDetailsRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
  },
  addressBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 32,
  },
  addressRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ticketsSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gep: 8,
  },
  artist: {
    fontFamily: 'Kanit-Medium',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 24,
    color: '#F5F6F8',
  },
  marginBottom24: {
    marginBottom: 24,
  },
  marginTop24: {
    marginTop: 24,
  },
  marginTop12: {
    marginTop: 12,
  },
  switch: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  switchButton: {
    paddingLeft: 12,
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 8,
    borderRadius: 12,
    width: '50%',
  },
  switchButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
  },
  font18Kanit: {
    fontSize: 18,
    lineHeight: 20,
    fontFamily: 'Kanit-Medium',
  },
  colorGray: {
    color: '#CACBCE',
  },
  marginRight8: {
    marginRight: 8,
  },
  marginLeft8: {
    marginLeft: 8,
  },
  font10Kanit: {
    fontFamily: 'Kanit-Regular',
    fontSize: 10,
    color: '#CACBCE',
  },
  font14Gold: {
    fontSize: 14,
    fontFamily: 'Kanit-Regular',
    lineHeight: 18,
    color: '#F6B027',
    textDecorationLine: 'underline',
  },
  mx30: {
    marginLeft: 30,
    marginRight: 30,
  },
});
