import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import CustomImageBackground from '../components/CustomImageBackground';
import Filter from '../components/Filter';

SplashScreen.preventAutoHideAsync();

export default function Favourites() {
  const [fontsLoaded, fontError] = useFonts({
    'Kanit-Regular': require('../../assets/fonts/Kanit-Regular.ttf'),
    'Kanit-Medium': require('../../assets/fonts/Kanit-Medium.ttf'),
    'Kanit-ExtraBold': require('../../assets/fonts/Kanit-ExtraBold.ttf'),
    'OpenSans-Regular': require('../../assets/fonts/OpenSans-Regular.ttf'),
  });

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
          <View style={styles.contentBox}>
            <View style={styles.headerBox}>
              <Text style={styles.textOrange}>OceanTickets</Text>
            </View>
            <Text style={styles.textSubtitle}>
              A world where every ticket is a story waiting to be lived. Let&apos;s write yours together
            </Text>
            <Filter />
            <Text style={styles.textSubtitle}>FAVOURITES</Text>
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerBox: {
    flex: 1,
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
});
