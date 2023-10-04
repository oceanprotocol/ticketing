import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';
import LocationSVG from '../../../assets/ph_map-pin.svg';
import CalendarSVG from '../../../assets/ph_calendar-blank.svg';
import TimerSVG from '../../../assets/ph_timer.svg';
import config from '../../../config';
import { EventType } from '../../constants/EventsData';
import { useAssetContext } from '../../context/AssetContext';

export default function EventRow({ event, ticket }: { event: EventType; ticket?: boolean }) {
  const { setEventId } = useAssetContext();

  return (
    <Link
      href={ticket ? config.routes.ticket.concat(event.id.toString()) : config.routes.event}
      onPress={() => (!ticket ? setEventId(event.id.toString()) : undefined)}
      asChild
      key={event.id}
    >
      <TouchableOpacity>
        <BlurView intensity={50} style={styles.ticket}>
          <Image source={event.image} style={styles.eventImage} />
          <View style={styles.ticketDescription}>
            <Text style={styles.artist}>{event.artist}</Text>
            <View style={styles.ticketDescriptionRow}>
              <LocationSVG width={16} height={16} />
              <Text style={styles.details}>{event.location}</Text>
            </View>
            <View style={styles.ticketDescriptionRow}>
              <CalendarSVG width={16} height={16} />
              <Text style={styles.details}>{event.date}</Text>
            </View>
            <View style={styles.ticketDescriptionRow}>
              <TimerSVG width={16} height={16} />
              <Text style={styles.details}>{event.time}</Text>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticket: {
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 20,
    width: '100%',
    overflow: 'hidden',
  },
  eventImage: {
    width: 100,
    height: 120,
    borderRadius: 8,
  },
  ticketDescription: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 10,
  },
  ticketDescriptionRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 4,
  },
  artist: {
    fontFamily: 'Kanit-Medium',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 24,
    color: '#F5F6F8',
  },
  details: {
    color: '#95989D',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    lineHeight: 19,
  },
});
