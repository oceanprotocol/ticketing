import { Image, StyleSheet, View, ScrollView, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';

import TicketBasicSVG from '../../../assets/Red.svg';
import TicketPremiumSVG from '../../../assets/Green.svg';
import TicketVipSVG from '../../../assets/Blue.svg';
import config from '../../../config';
import CustomImageBackground from '../../components/CustomImageBackground';
import { useAssetContext } from '../../context/AssetContext';
import { useCallback, useState } from 'react';

type TicketsRowsType = {
  name: string;
  noSeats: string;
  price: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logo: any;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
SplashScreen.preventAutoHideAsync();

export default function EventDetails() {
  const { price, handleTotalValueChange } = useAssetContext();
  const [isBackgroundImageLoaded, setBackgroundImageLoaded] = useState(true);
  const [fontsLoaded, fontError] = useFonts({
    'Kanit-Regular': require('../../../assets/fonts/Kanit-Regular.ttf'),
    'Kanit-Medium': require('../../../assets/fonts/Kanit-Medium.ttf'),
    'Kanit-Bold': require('../../../assets/fonts/Kanit-Bold.ttf'),
    'Kanit-ExtraBold': require('../../../assets/fonts/Kanit-ExtraBold.ttf'),
    'OpenSans-Regular': require('../../../assets/fonts/OpenSans-Regular.ttf'),
  });

  const onImageLoaded = () => {
    setBackgroundImageLoaded(false);
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError || isBackgroundImageLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isBackgroundImageLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const ticketsRows: TicketsRowsType[] = [
    {
      name: 'General access',
      noSeats: '12',
      price: '30',
      logo: <TicketBasicSVG width={44} height={40} />,
    },
    {
      name: 'Premium',
      noSeats: '23',
      price: '60',
      logo: <TicketPremiumSVG width={44} height={40} />,
    },
    {
      name: 'VIP',
      noSeats: '45',
      price: '90',
      logo: <TicketVipSVG width={44} height={40} />,
    },
  ];

  const CounterButton = ({ ticketPrice }: { ticketPrice: string }) => {
    return (
      <View style={styles.buy}>
        <TouchableOpacity onPress={() => handleTotalValueChange('0')}>
          <Text style={styles.buyText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.buyText}>{price === ticketPrice ? '1' : '0'}</Text>
        <TouchableOpacity onPress={() => handleTotalValueChange(ticketPrice)}>
          <Text style={styles.buyText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const TicketRow = ({ ticket }: { ticket: TicketsRowsType }) => {
    return (
      <View style={styles.ticketRow}>
        <View style={styles.ticketDescription}>
          {ticket.logo}
          <View style={[styles.ticketDetails, styles.marginLeft14]}>
            <Text style={[styles.font12Kanit, styles.textBold, styles.textWhite, styles.textUppercase]}>
              {ticket.name}
            </Text>
            <Text style={[styles.font12Kanit, styles.textWhite]}>{ticket.noSeats} Seats available</Text>
          </View>
        </View>
        <Text style={[styles.font12Kanit, styles.textBold, styles.textWhite]}>€{ticket.price}</Text>
        <CounterButton ticketPrice={ticket.price} />
      </View>
    );
  };

  return (
    <ScrollView bounces={false} style={styles.container} onLayout={onLayoutRootView}>
      <CustomImageBackground isLoaded={onImageLoaded} fullHeight>
        <View style={styles.heroImageContainer}>
          <Image source={require('../../../assets/Theater-info.png')} style={styles.heroImage} />
        </View>
        <View style={styles.containerBox}>
          <View style={styles.headerBox}>
            <Text style={styles.font20Kanit}>Tickets</Text>
            <Text style={styles.font12KanitBoldGold}>NO. OF TICKETS</Text>
          </View>
          {ticketsRows.map((ticket) => {
            return <TicketRow key={ticket.name} ticket={ticket} />;
          })}
          <Link href={`${config.routes.checkout}`} asChild>
            <TouchableOpacity style={styles.checkout}>
              <Text style={styles.buyText}>€{price}</Text>
              <Text style={styles.buyText}>Buy now</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <StatusBar style="light" />
      </CustomImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: '#3D1C1A',
    flex: 1,
  },
  imageBackground: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroImageContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  heroImage: {
    maxWidth: 350,
    maxHeight: 350,
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
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#F5F6F8',
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.15,
    lineHeight: 21,
  },
  font20Kanit: {
    fontFamily: 'Kanit-Medium',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 24,
    color: '#F5F6F8',
  },
  font12KanitBoldGold: {
    fontFamily: 'Kanit-Bold',
    fontSize: 12,
    fontWeight: '700',
    color: '#EBA722',
    textTransform: 'uppercase',
  },
  font16Kanit: {
    fontSize: 16,
    lineHeight: 24,
  },
  font12Kanit: {
    fontSize: 12,
    lineHeight: 18,
  },
  textBold: {
    fontFamily: 'Kanit-Bold',
    fontWeight: '700',
  },
  textWhite: {
    color: '#F5F6F8',
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  ticketRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketDescription: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  eventCtaBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  buy: {
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#F6B027',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkout: {
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#F6B027',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyText: {
    color: '#21242C',
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    textAlign: 'center',
  },
  marginLeft14: {
    marginLeft: 14,
  },
});
