import { useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { BlurView } from 'expo-blur';
import TicketSVG from '../../../assets/Ticket.svg';
import { Link } from 'expo-router';
import { EventType, EventsData } from '../../constants/EventsData';
import config from '../../../config';
import CustomImageBackground from '../../components/CustomImageBackground';
import Filter from '../../components/Filter';
import { useAssetContext } from '../../context/AssetContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ITEM_WIDTH = SCREEN_WIDTH * 0.85;

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const [fontsLoaded, fontError] = useFonts({
    'Kanit-Regular': require('../../../assets/fonts/Kanit-Regular.ttf'),
    'Kanit-Medium': require('../../../assets/fonts/Kanit-Medium.ttf'),
    'Kanit-ExtraBold': require('../../../assets/fonts/Kanit-ExtraBold.ttf'),
    'OpenSans-Regular': require('../../../assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-Bold': require('../../../assets/fonts/OpenSans-Bold.ttf'),
  });

  const { setEventId } = useAssetContext();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isBackgroundImageLoaded, setBackgroundImageLoaded] = useState(true);

  const onImageLoaded = () => {
    setBackgroundImageLoaded(false);
  };
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const totalWidth = event.nativeEvent.layoutMeasurement.width;
    const xPosition = event.nativeEvent.contentOffset.x;
    const currentSlide = Math.floor(xPosition / totalWidth);
    setCarouselIndex(currentSlide);
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError || isBackgroundImageLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isBackgroundImageLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ScrollView bounces={false} style={styles.container} onLayout={onLayoutRootView}>
      <CustomImageBackground isLoaded={onImageLoaded}>
        <View style={styles.containerBox}>
          <View style={styles.contentBox}>
            <View style={styles.headerBox}>
              <Text style={styles.textOrange}>OceanTickets</Text>
            </View>
            <Text style={styles.textSubtitle}>
              A world where every ticket is a story waiting to be lived. Let&apos;s write yours together
            </Text>
            <Filter />
          </View>

          <View style={styles.carouselContainer}>
            <FlatList
              horizontal
              data={EventsData}
              style={styles.carousel}
              snapToInterval={ITEM_WIDTH + ITEM_WIDTH * 0.05}
              decelerationRate="fast"
              onScroll={handleScroll}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }: { item: EventType }) => {
                return (
                  <View key={item.artist + item.image} style={styles.carousel}>
                    <Image source={item.image} style={styles.carouselImage} />
                    <View style={styles.carouselItemDetailsContainer}>
                      <BlurView intensity={50} blurReductionFactor={4} style={styles.carouselItemDetailsBackdrop}>
                        <Text style={styles.artist}>{item.artist}</Text>
                        <View style={styles.eventDescriptionBox}>
                          <Text style={styles.eventDescription}>{item.date}</Text>
                          <Text style={[styles.eventDescription, styles.marginX8]}>-</Text>
                          <Text style={styles.eventDescription}>{item.location}</Text>
                        </View>
                        <View style={styles.eventCtaBox}>
                          <TouchableOpacity style={styles.eventType}>
                            <Text style={styles.font14Grey}>{item.type}</Text>
                          </TouchableOpacity>
                          <View style={styles.eventDescriptionBox}>
                            <TicketSVG width={16} height={16} />
                            <Text style={styles.eventDescription}>{item.price}</Text>
                          </View>
                          <Link href={config.routes.event} onPress={() => setEventId(item.id.toString())} asChild>
                            <TouchableOpacity style={styles.buy}>
                              <Text style={styles.buyText}>Buy ticket</Text>
                            </TouchableOpacity>
                          </Link>
                        </View>
                      </BlurView>
                    </View>
                  </View>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
            />
            <View style={styles.pagination}>
              {EventsData.map((_, index) => {
                return (
                  <View
                    key={index}
                    style={[styles.paginationDot, carouselIndex === index ? styles.paginationDotActive : {}]}
                  />
                );
              })}
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
    backgroundColor: '#3D1C1A',
  },
  image: {
    flex: 3,
  },
  containerBox: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    paddingTop: 30,
    paddingBottom: 10,
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
  carouselImage: {
    width: ITEM_WIDTH,
    maxHeight: 500,
    resizeMode: 'cover',
    borderRadius: 32,
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
    alignItems: 'center',
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
    justifyContent: 'space-between',
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
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#F6B027',
  },
  buyText: {
    color: '#21242C',
    fontFamily: 'OpenSans-Bold',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
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
});
