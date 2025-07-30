import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DonationListScreen from '../screens/DonationListScreen';
import DeviceListScreen from '../screens/DeviceListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DonationFormScreen from '../screens/DonationFormScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const insets = useSafeAreaInsets(); //

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let IconComponent = Ionicons;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Donar') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Dispositivos') {
            IconComponent = MaterialIcons;
            iconName = 'devices';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <IconComponent name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#11A140',
        tabBarInactiveTintColor: '#999999',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 2,
        },
        // Ajustamos dinámicamente el padding inferior según el sistema
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0.5,
          borderTopColor: '#ccc',
          elevation: 5,
          height: 60 + insets.bottom, // espacio extra
          paddingBottom: 5 + insets.bottom,
          paddingTop: 5,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Donar" component={DonationListScreen} />
      {/*<Tab.Screen name="Dispositivos" component={DonationFormScreen} />*/}
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#11A140' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Iniciar Sesión' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Crear Cuenta' }} />
      <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
      <Stack.Screen name="DonationForm" component={DonationFormScreen} options={{ title: 'Nueva Donación' }} />
    </Stack.Navigator>
  );
}
