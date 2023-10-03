import { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Link } from 'expo-router';
import TicketSVG from '../../../assets/Ticket.svg';
import config from '../../../config';
import CustomImageBackground from '../../components/CustomImageBackground';
import { useAssetContext } from '../../context/AssetContext';
import CarouselCard from '../../components/CarouselCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ITEM_WIDTH = SCREEN_WIDTH * 0.85;

SplashScreen.preventAutoHideAsync();

export default function EventDetails() {
  const [fontsLoaded, fontError] = useFonts({
    'Kanit-Regular': require('../../../assets/fonts/Kanit-Regular.ttf'),
    'Kanit-Medium': require('../../../assets/fonts/Kanit-Medium.ttf'),
    'Kanit-Bold': require('../../../assets/fonts/Kanit-Bold.ttf'),
    'Kanit-ExtraBold': require('../../../assets/fonts/Kanit-ExtraBold.ttf'),
    'OpenSans-Regular': require('../../../assets/fonts/OpenSans-Regular.ttf'),
  });
  const { localEvent } = useAssetContext();
  const [isBackgroundImageLoaded, setBackgroundImageLoaded] = useState(true);

  const onImageLoaded = () => {
    setBackgroundImageLoaded(false);
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError || isBackgroundImageLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isBackgroundImageLoaded]);

  if (!fontsLoaded && !fontError && !isBackgroundImageLoaded) {
    return null;
  }

  if (!localEvent) {
    return null;
  }

  return (
    <ScrollView bounces={false} style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.imageEventContainer}>
        <Image source={localEvent.image} style={styles.imageEvent} resizeMode="cover" />
      </View>
      <CustomImageBackground fullHeight isLoaded={onImageLoaded}>
        <View style={styles.containerBox}>
          <View style={styles.contentBox}>
            <View style={styles.headerBox}>
              <Text style={styles.eventTitle}>{localEvent.artist}</Text>
            </View>
            <View style={[styles.eventDescriptionBox]}>
              <Text style={styles.font14Grey}>{localEvent.date}</Text>
              <Text style={[styles.font14Grey, styles.marginX8]}>-</Text>
              <Text style={styles.font14Grey}>{localEvent.location}</Text>
            </View>
            <View style={styles.eventCtaBox}>
              <TouchableOpacity style={styles.eventType}>
                <Text style={styles.font14Grey}>{localEvent.type}</Text>
              </TouchableOpacity>
              <View style={[styles.eventDescriptionBox, styles.marginX8]}>
                <TicketSVG width={16} height={16} />
                <Text style={styles.eventDescription}>{localEvent.price}</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View>
              <Text style={[styles.descriptionTitle, styles.marginBottom8]}>About the band</Text>
              <Text style={styles.font14Grey}>{localEvent.description}</Text>
            </View>
            <View style={styles.separator} />

            <View>
              <Text style={[styles.descriptionTitle, styles.marginBottom8]}>Also in this venue</Text>
              <CarouselCard />
            </View>
            <View style={styles.marginTop30}>
              <Text style={[styles.descriptionTitle, styles.marginBottom8]}>Also in this venue</Text>
              <CarouselCard />
            </View>
          </View>
        </View>
        <Link href={config.routes.seats} asChild>
          <TouchableOpacity style={styles.buy}>
            <Text style={styles.buyText}>Select Seats</Text>
          </TouchableOpacity>
        </Link>
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
  imageEventContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    maxHeight: 440,
    maxWidth: 420,
    overflow: 'hidden',
  },
  imageEvent: {
    width: SCREEN_WIDTH,
    maxHeight: 440,
  },
  image: {
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
  },
  contentBox: {
    overflow: 'visible',
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  eventTitle: {
    color: '#F5F6F8',
    fontSize: 32,
    lineHeight: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Kanit-Medium',
  },
  description: {
    textAlign: 'left',
  },
  textSubtitle: {
    color: '#F5F6F8',
    fontFamily: 'Kanit-Medium',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: -0.2,
    lineHeight: 21,
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
  button: {
    color: '#21242C',
  },
  carouselContainer: {
    position: 'relative',
  },
  carousel: {
    position: 'relative',
    overflow: 'visible',
    maxHeight: 620,
  },
  carouselSmall: {
    position: 'relative',
    overflow: 'visible',
    maxHeight: 172,
  },
  carouselImage: {
    width: ITEM_WIDTH,
    maxHeight: 500,
    resizeMode: 'cover',
    borderRadius: 32,
  },
  carouselItemSmall: {
    borderRadius: 32,
    maxHeight: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  carouselImageSmall: {
    width: ITEM_WIDTH,
    maxHeight: 172,
    resizeMode: 'cover',
  },
  carouselItemDetailsContainer: {
    width: '90%',
    borderRadius: 24,
    minHeight: 146,
    position: 'absolute',
    bottom: 60,
    left: ITEM_WIDTH * 0.05,
    right: 'auto',
    overflow: 'hidden',
  },
  carouselItemDetailsBackdrop: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(205, 207, 212, 0.10)',
    padding: 16,
  },
  artist: {
    fontFamily: 'Kanit-Medium',
    fontSize: 32,
    fontWeight: '500',
    lineHeight: 35,
    color: '#F5F6F8',
  },
  eventDescriptionBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  eventDescription: {
    color: '#F5F6F8',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    lineHeight: 19,
  },
  eventCtaBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  eventType: {
    borderRadius: 100,
    borderWidth: 0.5,
    borderCurve: 'continuous',
    borderLeftColor: '#95989D',
    borderRightColor: '#95989D',
    borderBlockColor: '#95989D',
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 12,
    paddingLeft: 12,
  },
  font14Grey: {
    color: '#95989D',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    lineHeight: 19,
  },
  buy: {
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 8,
    padding: 8,
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#F6B027',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buyText: {
    color: '#21242C',
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    textAlign: 'center',
  },
  pagination: {
    width: SCREEN_WIDTH * 0.85,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    bottom: 30,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 16,
    height: 2,
    borderRadius: 8,
    backgroundColor: '#95989D',
  },
  paginationDotActive: {
    width: 32,
    height: 2,
    borderRadius: 8,
    backgroundColor: '#F5F6F8',
  },
  marginX8: {
    marginLeft: 8,
    marginRight: 8,
  },
  marginBottom8: {
    marginBottom: 8,
  },
  justifyContentStart: {
    justifyContent: 'flex-start',
  },
  separator: {
    backgroundColor: '#95989D',
    width: '100%',
    height: 0.5,
    opacity: 0.8,
    marginTop: 30,
    marginBottom: 30,
  },
  descriptionTitle: {
    fontFamily: 'Kanit-Medium',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '500',
    letterSpacing: -0.2,
    color: '#F5F6F8',
  },
  carouselImageSmallDetails: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 20,
  },
  flexColumnEnd: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignContent: 'stretch',
    padding: 18,
    height: '100%',
  },
  font18KanitRegular: {
    color: '#fff',
    fontFamily: 'Kanit-Regular',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
  },
  eventCtaBoxSmall: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginTop30: {
    marginTop: 30,
  },
});
