import { Tabs } from 'expo-router/tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIconsAntDesign from 'react-native-vector-icons/AntDesign';
import { Redirect } from 'expo-router';
import { WalletContextProvider } from '../context/WalletContext';
import { AssetContextProvider } from '../context/AssetContext';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(["Warning: The provided value 'moz", "Warning: The provided value 'ms-stream"]);

export default function AppLayout() {
  return (
    <>
      <WalletContextProvider>
        <AssetContextProvider>
          {/* Fix for the initial render */}
          <Redirect href="/home" />
          <Tabs
            initialRouteName="home"
            screenOptions={{
              tabBarActiveTintColor: '#F5F6F8',
              tabBarInactiveTintColor: '#95989D',
              headerShown: false,
              tabBarShowLabel: false,
              headerStyle: {
                backgroundColor: '#21242C',
              },
              tabBarStyle: {
                backgroundColor: '#21242C',
              },
            }}
          >
            <Tabs.Screen
              name="home"
              options={{
                tabBarActiveTintColor: '#F5F6F8',
                tabBarInactiveTintColor: '#95989D',
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
              }}
            />
            <Tabs.Screen
              name="search"
              options={{
                tabBarActiveTintColor: '#F5F6F8',
                tabBarInactiveTintColor: '#95989D',
                tabBarLabel: 'Search',
                title: 'Search',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIconsAntDesign name="search1" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="favourites"
              options={{
                href: null,
                tabBarActiveTintColor: '#F5F6F8',
                tabBarInactiveTintColor: '#95989D',
                tabBarLabel: 'Favourites',
                tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="heart" color={color} size={size} />,
              }}
            />
            <Tabs.Screen
              name="myAccount"
              options={{
                tabBarActiveTintColor: '#F5F6F8',
                tabBarInactiveTintColor: '#95989D',
                tabBarLabel: 'MyAccount',
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="account-outline" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="welcome"
              options={{
                // This tab will no longer show up in the tab bar.
                href: null,
              }}
            />
          </Tabs>
        </AssetContextProvider>
      </WalletContextProvider>
    </>
  );
}
