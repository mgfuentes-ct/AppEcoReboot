// src/screens/DonationListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getDonations } from '../api/api';

const DonationListScreen = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      const data = await getDonations();
      setDonations(data);
    };
    fetchDonations();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Donaciones</Text>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.id_donacion.toString()}
        renderItem={({ item }) => (
          <View style={styles.donationItem}>
            <Text style={styles.donationTitle}>
              Donación #{item.id_donacion}
            </Text>
            <Text style={styles.donationDetail}>
              Usuario: {item.usuario?.nombre}
            </Text>
            <Text style={styles.donationDetail}>
              Tipo: {item.tipo?.nombre}
            </Text>
            <Text style={styles.donationDetail}>
              Estado: {item.estado?.nombre}
            </Text>
            <Text style={styles.donationDetail}>
              Fecha: {item.fecha.toISOString().split('T')[0]}
            </Text>
            <Text style={styles.donationDetail}>
              Total Dispositivos: {item.total_dispositivos}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  donationItem: {
    backgroundColor: '#cfe2ff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  donationDetail: {
    fontSize: 16,
    color: '#333',
  },
});

export default DonationListScreen;