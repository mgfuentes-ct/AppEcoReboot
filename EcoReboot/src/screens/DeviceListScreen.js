// src/screens/DeviceListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getDevices } from '../api/api';

const DeviceListScreen = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      const data = await getDevices();
      setDevices(data);
    };
    fetchDevices();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Dispositivos</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id_dispositivo.toString()}
        renderItem={({ item }) => (
          <View style={styles.deviceItem}>
            <Text style={styles.deviceTitle}>
              Dispositivo #{item.id_dispositivo}
            </Text>
            <Text style={styles.deviceDetail}>
              Descripción: {item.descripcion || 'Sin descripción'}
            </Text>
            <Text style={styles.deviceDetail}>
              Modelo: {item.modelo || 'Sin modelo'}
            </Text>
            <Text style={styles.deviceDetail}>
              Nombre: {item.nombre || 'Sin nombre'}
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
  deviceItem: {
    backgroundColor: '#d4edda',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  deviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceDetail: {
    fontSize: 16,
    color: '#333',
  },
});

export default DeviceListScreen;