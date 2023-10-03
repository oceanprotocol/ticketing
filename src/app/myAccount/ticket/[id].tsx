import { useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import CustomImageBackground from '../../../components/CustomImageBackground';
import SuccessSVG from '../../../../assets/success.svg';
import TearLineSeparatorSVG from '../../../../assets/Tear_Line.svg';
import { Link, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useAssetContext } from '../../../context/AssetContext';
import { EventsData } from '../../../constants/EventsData';
import config from '../../../../config';
import QRCode from 'react-native-qrcode-svg';

export default function TicketDetails() {
  const [fontsLoaded, fontError] = useFonts({
    'Kanit-Regular': require('../../../../assets/fonts/Kanit-Regular.ttf'),
    'Kanit-Medium': require('../../../../assets/fonts/Kanit-Medium.ttf'),
    'Kanit-ExtraBold': require('../../../../assets/fonts/Kanit-ExtraBold.ttf'),
    'OpenSans-Regular': require('../../../../assets/fonts/OpenSans-Regular.ttf'),
  });

  const { reset } = useNavigation();
  const { tokenAccessDetails } = useAssetContext();
  const { id } = useLocalSearchParams();
  const eventId = id as string;

  const localEvent = useMemo(() => {
    if (!eventId) {
      return;
    }
    const event = EventsData.find((event) => {
      return event.id === parseInt(eventId, 10);
    });
    return event;
  }, [eventId]);

  useFocusEffect(
    useCallback(() => {
      // If you want to do something when screen is focused
      return () => {
        // This is called when the screen is not focused
        // i.e. switched to a different tab or the hardware back button is pressed (Android)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:disable-next-line
        reset({ index: 0, routes: [{ name: 'myAccount' }] });
      };
    }, [reset]),
  );

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
      <CustomImageBackground>
        <View style={styles.containerBox}>
          <View style={styles.contentBox}>
            <View style={styles.headerBox}>
              <SuccessSVG width={60} height={60} />
              <Text style={[styles.textOrange, styles.marginTop16]}>Tickets Booked Succesfully!</Text>
            </View>
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={`https://mumbai.polygonscan.com/tx/${tokenAccessDetails[parseInt(eventId, 10) - 1]
                  ?.validOrderTx}`}
                size={256}
              />
            </View>
            <TearLineSeparatorSVG width={'100%'} />
            <View style={styles.details}>
              <Text style={[styles.font20Kanit, styles.marginBottom16]}>{localEvent?.artist}</Text>
              <View style={styles.detailsRow}>
                <Text style={[styles.font14, styles.textGrey, styles.width30Percent]}>Venue</Text>
                <Text style={[styles.font14, styles.textWhite, styles.textBold]}>{localEvent?.location}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={[styles.font14, styles.textGrey, styles.width30Percent]}>Date</Text>
                <Text style={[styles.font14, styles.textWhite, styles.textBold]}>{localEvent?.date}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={[styles.font14, styles.textGrey, styles.width30Percent]}>Time</Text>
                <Text style={[styles.font14, styles.textWhite, styles.textBold]}>{localEvent?.time}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={[styles.font14, styles.textGrey, styles.width30Percent]}>Access Area</Text>
                <Text style={[styles.font14, styles.textWhite, styles.textBold]}>General Access</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={[styles.font14, styles.textGrey, styles.width30Percent]}>Price</Text>
                <Text style={[styles.font14, styles.textWhite, styles.textBold]}>
                  {tokenAccessDetails[parseInt(eventId, 10) - 1]?.price} Ocean
                </Text>
              </View>
              <Link href={config.routes.account} asChild style={styles.showAll}>
                <Text>View all tickets</Text>
              </Link>
            </View>
          </View>

          <StatusBar style="light" />
        </View>
      </CustomImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#3D1C1A',
  },
  image: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerBox: {
    width: '100%',
    flexDirection: 'column',
    paddingTop: 30,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 75,
    gap: 24,
  },
  qrCodeContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  qrCode: {
    width: 256,
    height: 256,
  },
  details: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignContent: 'center',
    marginTop: 24,
  },
  contentBox: {
    overflow: 'visible',
  },
  headerBox: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 80,
    marginBottom: 21,
  },
  textOrange: {
    color: '#F6B027',
    fontSize: 24,
    lineHeight: 27,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Kanit-Medium',
  },
  detailsRow: {
    marginTop: 5,
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  marginTop16: {
    marginTop: 16,
  },
  marginBottom16: {
    marginBottom: 16,
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
  width30Percent: {
    width: '40%',
  },
  showAll: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    fontFamily: 'OpenSans-Regular',
    letterSpacing: -0.16,
    textDecorationLine: 'underline',
    color: '#F6B027',
    textAlign: 'center',
    marginTop: 12,
  },
});
