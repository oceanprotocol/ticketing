// import React from 'react';
// import { NavigationContainer, DarkTheme } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// // import HomeLogo from '../../../assets/ph_house-fill.svg';
// // import MyTicketsLogo from '../../../assets/ph_ticket.svg';
// // import SearchLogo from '../../../assets/ph_magnifying-glass.svg';
// // import FavouritesLogo from '../../../assets/ph_heart.svg';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import MaterialCommunityIconsAntDesign from 'react-native-vector-icons/AntDesign';

// import Home from '../../app/home';
// import MyTickets from '../../app/myTickets';
// import Search from '../../app/search';
// import Favourites from '../../app/favourites';
// import EventDetails from '../../app/home/event/[id]';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function AppNavigationTabs() {
//   return (
//     <Tab.Navigator
//       initialRouteName="Home"
//       screenOptions={{
//         tabBarActiveTintColor: '#F5F6F8',
//         tabBarInactiveTintColor: '#95989D',
//         headerShown: false,
//         tabBarShowLabel: false,
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={Home}
//         options={{
//           tabBarActiveTintColor: '#F5F6F8',
//           tabBarInactiveTintColor: '#95989D',
//           tabBarLabel: 'Home',
//           tabBarIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="home" color={color} size={size} fill={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="MyTickets"
//         component={MyTickets}
//         options={{
//           tabBarActiveTintColor: '#F5F6F8',
//           tabBarInactiveTintColor: '#95989D',
//           tabBarLabel: 'MyTickets',
//           tabBarIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="ticket" color={color} size={size} fill={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Search"
//         component={Search}
//         options={{
//           tabBarActiveTintColor: '#F5F6F8',
//           tabBarInactiveTintColor: '#95989D',
//           tabBarLabel: 'Search',
//           tabBarIcon: ({ color, size }) => (
//             <MaterialCommunityIconsAntDesign name="search1" color={color} size={size} fill={color} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Favourites"
//         component={Favourites}
//         options={{
//           tabBarActiveTintColor: '#F5F6F8',
//           tabBarInactiveTintColor: '#95989D',
//           tabBarLabel: 'Favourites',
//           tabBarIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="heart" color={color} size={size} fill={color} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// function AppNavigation() {
//   return (
//     <NavigationContainer theme={DarkTheme}>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="HomeScreen" component={AppNavigationTabs} />
//         <Stack.Screen name="EventDetails" component={EventDetails} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default AppNavigation;
