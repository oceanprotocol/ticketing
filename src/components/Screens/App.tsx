import { useEffect } from 'react';
import Home from '../../app/home';
import { Provider } from 'urql';
import { client } from '../../graphql';
import { AssetContextProvider } from '../../context/AssetContext';
import { LogBox, View } from 'react-native';
import { SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';

LogBox.ignoreLogs(["Warning: The provided value 'moz", "Warning: The provided value 'ms-stream"]);

export default function App() {
  const [fontsLoaded] = useFonts({
    'Kanit-Regular': require('../../../assets/fonts/Kanit-Regular.ttf'),
    'Kanit-Medium': require('../../../assets/fonts/Kanit-Medium.ttf'),
    'Kanit-Bold': require('../../../assets/fonts/Kanit-Bold.ttf'),
    'Kanit-ExtraBold': require('../../../assets/fonts/Kanit-ExtraBold.ttf'),
    'OpenSans-Regular': require('../../../assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-Bold': require('../../../assets/fonts/OpenSans-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <Provider value={client}>
      <AssetContextProvider>
        <View style={{ backgroundColor: '#000' }}>
          <Home />
        </View>
      </AssetContextProvider>
    </Provider>
  );
}
