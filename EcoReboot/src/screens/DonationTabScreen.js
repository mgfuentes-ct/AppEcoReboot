// src/screens/DonationTabScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DonationListScreen from './DonationListScreen';
import AllDonationsScreen from './Admin/AllDonationsScreen';

export default function DonationTabScreen({ navigation, route }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
      setLoading(false);
    };
    loadRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#11A140" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  // Decidir qué pantalla mostrar
return userRole === 'Administrador' ? (
    <AllDonationsScreen navigation={navigation} route={route} />
  ) : (
    <DonationListScreen navigation={navigation} route={route} />
  );
}