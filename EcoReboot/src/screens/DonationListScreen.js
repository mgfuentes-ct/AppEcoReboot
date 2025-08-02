import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DonationListScreen = ({ navigation }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    return id ? parseInt(id) : null;
  };

  const fetchUserDonations = async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        console.log('No hay usuario autenticado');
        setDonations([]);
        return;
      }

      console.log('Obteniendo donaciones para usuario:', userId);

      const response = await axios.get(`${API_URL}/donaciones/usuario/${userId}`);

      console.log('Respuesta completa:', response);
      console.log('Donaciones recibidas:', response.data);

      if (response.data && Array.isArray(response.data)) {
        setDonations(response.data);
      } else {
        console.log('La respuesta no es un array:', response.data);
        setDonations([]);
      }
    } catch (error) {
      console.error('Error al cargar donaciones:', error.response?.data || error.message);
      console.error('Error completo:', error); 
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Pantalla enfocada: recargando donaciones...');
      setLoading(true);
      fetchUserDonations();
    });


    fetchUserDonations();

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Mis Donaciones</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando donaciones...</Text>
          </View>
        ) : donations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aún no has donado ningún dispositivo.</Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('DonationForm')}
            >
              <Text style={styles.ctaButtonText}>¡Haz tu primera donación!</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={donations}
            keyExtractor={(item) => item.id_donacion.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.donationItem}>
                <Text style={styles.donationTitle}>Donación #{index + 1}</Text>
                <Text style={styles.donationDetail}>Tipo: {item.tipo?.nombre}</Text>
                <Text style={styles.donationDetail}>Estado: {item.estado?.nombre}</Text>
                <Text style={styles.donationDetail}>
                  Fecha: {item.fecha ? new Date(item.fecha).toISOString().split('T')[0] : 'Sin fecha'}
                </Text>
                <Text style={styles.donationDetail}>
                  Total Dispositivos: {item.total_dispositivos}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('DonationForm')}
        >
          <Text style={styles.addButtonText}>Donar nuevo dispositivo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FFF8',
  },
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11A140',
    marginBottom: 20,
    textAlign: 'center',
  },
  donationItem: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginBottom: 15,
  },
  ctaButton: {
    backgroundColor: '#11A140',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#11A140',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DonationListScreen;