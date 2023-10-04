import { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import CustomImageBackground from '../components/CustomImageBackground';
import CloseBtnSVG from '../../assets/close_btn.svg';
import { EventsData } from '../constants/EventsData';
import EventRow from '../components/EventRow';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
SplashScreen.preventAutoHideAsync();

export default function Search() {
  const [searchInput, setSearchInput] = useState('');
  const [fontsLoaded, fontError] = useFonts({
    'Kanit-Regular': require('../../assets/fonts/Kanit-Regular.ttf'),
    'Kanit-Medium': require('../../assets/fonts/Kanit-Medium.ttf'),
    'Kanit-ExtraBold': require('../../assets/fonts/Kanit-ExtraBold.ttf'),
    'OpenSans-Regular': require('../../assets/fonts/OpenSans-Regular.ttf'),
  });

  const onTextInput = useCallback((input: string) => {
    setSearchInput(input);
  }, []);

  const resetTextInput = useCallback(() => {
    setSearchInput('');
  }, []);

  const filteredEvents = useMemo(() => {
    return EventsData.filter((event) => event.artist.includes(searchInput));
  }, [searchInput]);

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
      <CustomImageBackground fullHeight>
        <View style={styles.containerBox}>
          <Text style={[styles.pageTitle]}>Search</Text>
          <View style={[styles.row, styles.marginTop34, styles.marginBottom24]}>
            <TextInput style={[styles.input]} onChangeText={(e) => onTextInput(e)} value={searchInput} />
            <TouchableOpacity style={styles.closeBtn} onPress={() => resetTextInput()}>
              <CloseBtnSVG width={12} height={12} />
            </TouchableOpacity>
          </View>
          <View style={styles.ticketsSection}>
            {filteredEvents.map((event) => {
              return <EventRow key={event.id} event={event} />;
            })}
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
    minHeight: SCREEN_HEIGHT,
  },
  containerBox: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    paddingTop: 64,
    paddingLeft: 24,
    paddingRight: 24,
  },
  contentBox: {
    overflow: 'visible',
  },
  textSubtitle: {
    color: '#F5F6F8',
    fontFamily: 'Kanit-Medium',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: -0.2,
    lineHeight: 21,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '85%',
  },
  pageTitle: {
    fontFamily: 'Kanit-Medium',
    fontSize: 24,
    lineHeight: 26,
    color: '#F5F6F8',
    textAlign: 'center',
  },
  marginBottom24: {
    marginBottom: 47,
  },
  marginTop34: {
    marginTop: 34,
  },
  marginbottom34: {
    marginBottom: 34,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    borderRadius: 100,
    width: 32,
    height: 32,
    flexShrink: 0,
    backgroundColor: '#fff',
    shadowColor: '0px 2px 15px rgba(26, 60, 68, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketsSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gep: 8,
  },
});
