import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function HomeLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerLargeTitleShadowVisible: false,
          headerTransparent: true,
          animation: 'simple_push',
          presentation: 'card',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen
          name="event"
          options={{
            title: '',
            headerBackButtonMenuEnabled: true,
            headerTintColor: '#F5F6F8',
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: '500',
              fontFamily: 'Kanit-Medium',
            },
          }}
        />
        <Stack.Screen
          name="seats"
          options={{
            title: '',
            headerBackButtonMenuEnabled: true,
            headerTintColor: '#F5F6F8',
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: '500',
              fontFamily: 'Kanit-Medium',
            },
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            title: '',
            headerBackButtonMenuEnabled: true,
            headerTintColor: '#F5F6F8',
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: '500',
              fontFamily: 'Kanit-Medium',
            },
            headerBackTitle: '',
          }}
        />
      </Stack>
    </View>
  );
}
