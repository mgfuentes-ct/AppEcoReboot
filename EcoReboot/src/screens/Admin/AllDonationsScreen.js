// src/screens/Admin/AllDonationsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { API_URL } from '../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AllDonationsScreen({ navigation }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verificar rol del usuario
  const checkRole = async () => {
    const role = await AsyncStorage.getItem('userRole');
    if (role !== 'Administrador') {
      Alert.alert('Acceso denegado', 'Solo los administradores pueden ver esta pantalla');
      navigation.goBack();
    }
  };

  const fetchAllDonations = async () => {
    try {
      const response = await axios.get(`${API_URL}/donaciones/`);
      setDonations(response.data);
    } catch (error) {
      console.error('Error al cargar todas las donaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las donaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      checkRole();
      fetchAllDonations();
    });

    // Cargar al montar
    checkRole();
    fetchAllDonations();

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Todas las Donaciones</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#11A140" />
          <Text style={styles.loadingText}>Cargando donaciones...</Text>
        </View>
      ) : donations.length === 0 ? (
        <Text style={styles.emptyText}>No hay donaciones registradas en el sistema.</Text>
      ) : (
        <FlatList
          data={donations}
          keyExtractor={(item) => item.id_donacion.toString()}
          renderItem={({ item }) => (
            <View style={styles.donationItem}>
              <Text style={styles.donationTitle}>
                Donación #{item.id_donacion} - {item.tipo?.nombre}
              </Text>
              <Text style={styles.donationDetail}>
                Usuario: {item.usuario?.nombre}
              </Text>
              <Text style={styles.donationDetail}>
                Estado: {item.estado?.nombre}
              </Text>
              <Text style={styles.donationDetail}>
                Fecha: {item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : 'Sin fecha'}
              </Text>
              <Text style={styles.donationDetail}>
                Dispositivos: {item.total_dispositivos}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFF8',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11A140',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  donationItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11A140',
    marginBottom: 6,
  },
  donationDetail: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
});