import { Stack } from 'expo-router';

export default function MyAccountLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerLargeTitleShadowVisible: false,
        headerTransparent: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false, title: 'MyAccount' }} />

      <Stack.Screen
        name="ticket/[id]"
        options={{
          title: '',
          headerBackButtonMenuEnabled: true,
        }}
      />
    </Stack>
  );
}
