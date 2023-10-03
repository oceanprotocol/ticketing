import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { ImageBackground, StyleSheet, Text, View, Dimensions, Platform, PixelRatio, Button } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

export default function Welcome() {
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

  const { width: SCREEN_WIDTH } = Dimensions.get('window');

  //use your testing phone width to replace 320
  const scale = SCREEN_WIDTH / 320;

  function normalize(size) {
    const newSize = size * scale;
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 3,
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    image: {
      flex: 3,
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    imageGradient: {
      flex: 3,
      width: '100%',
      paddingTop: 68,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textOrange: {
      color: '#F6B027',
      fontSize: 42,
      lineHeight: 84,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: 'Kanit-ExtraBold',
    },
    description: {
      paddingRight: 15,
      paddingBottom: 60,
      paddingLeft: 15,
    },
    textH1: {
      color: '#F5F6F8',
      textAlign: 'center',
      fontFamily: 'Kanit-Medium',
      fontSize: normalize(25),
      fontWeight: '500',
      letterSpacing: -0.32,
      lineHeight: 58,
    },
    textSubtitle: {
      color: '#F5F6F8',
      textAlign: 'center',
      fontFamily: 'Kanit-Medium',
      fontSize: normalize(13),
      fontWeight: '500',
      letterSpacing: -0.17,
      lineHeight: 31,
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
    goldGradient: {
      marginTop: 24,
      paddingTop: 8,
      paddingLeft: 24,
      paddingBottom: 8,
      paddingRight: 24,
      borderRadius: 8,
    },
    button: {
      color: '#21242C',
    },
  });

  return (
    <NavigationContainer>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <ImageBackground source={require('../../assets/image_welcome.jpg')} resizeMode="cover" style={styles.image}>
          <LinearGradient colors={['rgba(0, 0, 0, 0.00)', '#000']} style={styles.imageGradient}>
            <Text style={styles.textOrange}>OceanTickets</Text>
            <View style={styles.description}>
              <Text style={styles.textH1}>Welcome to OceanTickets</Text>
              <Text style={styles.textSubtitle}>Discover and Experience Events Like Never Before</Text>
              <Text style={styles.text}>
                Join a world of captivating events, from heart-pounding concerts to mind-opening exhibitions.
              </Text>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#F6B027', '#DB9205']}
                style={styles.goldGradient}
              >
                <Button title="Get Started" />
              </LinearGradient>
            </View>
            <StatusBar style="auto" />
          </LinearGradient>
        </ImageBackground>
      </View>
    </NavigationContainer>
  );
}
