import { ReactNode } from 'react';
import { Dimensions, ImageBackground, StyleSheet } from 'react-native';

type CustomImageBackgroundPropType = {
  children: ReactNode;
  fullHeight?: boolean;
  isLoaded?: () => void;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CustomImageBackground({ children, fullHeight, isLoaded }: CustomImageBackgroundPropType) {
  const styles = StyleSheet.create({
    image: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      width: '100%',
      minHeight: fullHeight ? SCREEN_HEIGHT : '100%',
    },
  });

  return (
    <ImageBackground
      source={require('../../../assets/bg-unblured.jpg')}
      onLoad={isLoaded}
      blurRadius={85}
      style={styles.image}
      imageStyle={{
        resizeMode: 'cover',
        width: 916,
        height: fullHeight ? SCREEN_HEIGHT * 1.5 : '100%',
        top: 0,
        left: -225,
      }}
    >
      {children}
    </ImageBackground>
  );
}
