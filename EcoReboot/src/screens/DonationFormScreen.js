// src/screens/DonationFormScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { API_URL } from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function DonationFormScreen({ navigation }) {
  const [telefono, setTelefono] = useState('');
  const [imperfecciones, setImperfecciones] = useState('');
  const [totalDispositivos, setTotalDispositivos] = useState('');
  const [idTipo, setIdTipo] = useState(null); // Inicialmente nulo
  const [idEstado, setIdEstado] = useState(null); // Inicialmente nulo
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Tipos y estados (puedes cargarlos desde la API si lo prefieres)
  const tipos = [
    { id: '1', nombre: 'Laptop' },
    { id: '2', nombre: 'PC' },
    { id: '3', nombre: 'Tablet' },
    { id: '4', nombre: 'Monitor' },
  ];

  const estados = [
    { id: '1', nombre: 'Funcional' },
    { id: '2', nombre: 'Defectuoso' },
  ];

  // Obtener el ID del usuario al cargar
  useEffect(() => {
    const loadUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        setUserId(parseInt(id));
      } else {
        Alert.alert('Error', 'No has iniciado sesión');
        navigation.goBack();
      }
    };
    loadUserId();
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'No se pudo obtener el usuario');
      return;
    }

    if (!telefono || !totalDispositivos || !idTipo || !idEstado) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const donacionData = {
  id_tipo_electrodomestico: parseInt(idTipo),
  id_estado_dispositivo: parseInt(idEstado),
  fecha: new Date().toISOString().split('T')[0], // "2025-07-30"
  imperfecciones: imperfecciones || null,
  telefono,
  total_dispositivos: parseInt(totalDispositivos),
};

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/usuarios/${userId}/donaciones`,
        donacionData
      );

      Alert.alert('Éxito', 'Donación registrada correctamente');
      setTelefono('');
      setImperfecciones('');
      setTotalDispositivos('');
      setIdTipo(null);
      setIdEstado(null);

      // Volver a la lista de donaciones
      navigation.navigate('Donar'); // Asegúrate que el nombre coincida
    } catch (error) {
      console.error('Error al registrar donación:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.detail || 'No se pudo registrar la donación'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registrar Nueva Donación</Text>

      <Text style={styles.label}>Teléfono de contacto *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 5554567890"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Tipo de dispositivo *</Text>
      {tipos.map((tipo) => (
        <TouchableOpacity
          key={tipo.id}
          style={[
            styles.optionButton,
            idTipo === tipo.id && styles.optionSelected,
          ]}
          onPress={() => setIdTipo(tipo.id)}
        >
          <Text
            style={[
              styles.optionText,
              idTipo === tipo.id && styles.optionTextSelected,
            ]}
          >
            {tipo.nombre}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Estado del dispositivo *</Text>
      {estados.map((estado) => (
        <TouchableOpacity
          key={estado.id}
          style={[
            styles.optionButton,
            idEstado === estado.id && styles.optionSelected,
          ]}
          onPress={() => setIdEstado(estado.id)}
        >
          <Text
            style={[
              styles.optionText,
              idEstado === estado.id && styles.optionTextSelected,
            ]}
          >
            {estado.nombre}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Imperfecciones (opcional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ej. Pantalla rota, teclado dañado"
        value={imperfecciones}
        onChangeText={setImperfecciones}
        multiline
        numberOfLines={3}
      />

      <Text style={styles.label}>Cantidad de dispositivos *</Text>
      <TextInput
        style={styles.input}
        placeholder="1"
        value={totalDispositivos}
        onChangeText={setTotalDispositivos}
        keyboardType="numeric"
      />

      {loading ? (
        <View style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Registrando...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Registrar Donación</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FFF8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11A140',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionSelected: {
    backgroundColor: '#E8F5E8',
    borderColor: '#11A140',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#11A140',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#11A140',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
