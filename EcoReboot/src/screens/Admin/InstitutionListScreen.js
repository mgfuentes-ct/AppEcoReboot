// src/screens/Admin/InstitutionListScreen.js
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
import axios from 'axios';

export default function InstitutionListScreen({ navigation }) {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInstitutions = async () => {
    try {
      const response = await axios.get(`${API_URL}/instituciones/`);
      setInstitutions(response.data);
    } catch (error) {
      console.error('Error al cargar instituciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las instituciones');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar institución',
      '¿Estás seguro de que deseas eliminar esta institución?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          async onPress() {
            try {
              await axios.delete(`${API_URL}/instituciones/${id}`);
              fetchInstitutions(); // Recargar lista
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la institución');
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      fetchInstitutions();
    });

    fetchInstitutions();

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Instituciones</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#11A140" />
          <Text style={styles.loadingText}>Cargando instituciones...</Text>
        </View>
      ) : institutions.length === 0 ? (
        <Text style={styles.emptyText}>No hay instituciones registradas.</Text>
      ) : (
        <FlatList
          data={institutions}
          keyExtractor={(item) => item.id_institucion.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.info}>
                <Text style={styles.name}>{item.nombre}</Text>
                <Text style={styles.phone}>{item.telefono}</Text>
                <Text style={styles.count}>Cantidad: {item.cantidad || 'No especificado'}</Text>
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('InstitutionForm', { institution: item })}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id_institucion)}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('InstitutionForm')}
      >
        <Text style={styles.addButtonText}>+ Nueva Institución</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFF8',
    padding: 20,
    marginTop: 20,
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
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  phone: {
    fontSize: 15,
    color: '#666',
  },
  count: {
    fontSize: 14,
    color: '#11A140',
    fontWeight: '500',
  },
  buttons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#11A140',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});