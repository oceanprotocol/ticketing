import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

import { EventType, EventsData } from '../../constants/EventsData';
import { useAssetContext } from '../../context/AssetContext';
import TicketSVG from '../../../assets/Ticket.svg';
import config from '../../../config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ITEM_WIDTH = SCREEN_WIDTH * 0.85;

export default function CarouselCard() {
  const { setEventId, localEvent } = useAssetContext();

  return (
    <FlatList
      horizontal
      data={EventsData}
      style={styles.carouselSmall}
      snapToInterval={ITEM_WIDTH + ITEM_WIDTH * 0.05}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }: { item: EventType }) => {
        return (
          <Link key={item.id} href={config.routes.event} onPress={() => setEventId(item.id.toString())}>
            <View key={item.id} style={styles.carouselSmall}>
              <View style={styles.carouselItemSmall}>
                <Image source={item.image} style={styles.carouselImageSmall} />
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 2 }}
                  colors={['rgba(0, 0, 0, 0.00)', '#56082F']}
                  style={styles.carouselImageSmallDetails}
                >
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 2 }}
                    colors={['rgba(2, 112, 214, 0.00)', '#002166']}
                    style={styles.carouselImageSmallDetails}
                  >
                    <View style={styles.flexColumnEnd}>
                      <Text style={styles.font18KanitRegular}>{item.artist}</Text>
                      <View style={styles.eventCtaBoxSmall}>
                        <View style={[styles.eventDescriptionBox, styles.marginX8]}>
                          <TicketSVG width={16} height={16} />
                          <Text style={styles.eventDescription}>{localEvent?.price}</Text>
                        </View>
                        <TouchableOpacity style={styles.eventType}>
                          <Text style={styles.font14Grey}>{localEvent?.type}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </LinearGradient>
                </LinearGradient>
              </View>
            </View>
          </Link>
        );
      }}
      ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: '#3D1C1A',
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
