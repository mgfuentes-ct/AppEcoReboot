// src/screens/Admin/InstitutionFormScreen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../api/config';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function InstitutionFormScreen({ route, navigation }) {
  const { institution } = route.params || {};
  const isEditing = !!institution;

  const [nombre, setNombre] = useState(institution?.nombre || '');
  const [telefono, setTelefono] = useState(institution?.telefono || '');
  const [cantidad, setCantidad] = useState(institution?.cantidad?.toString() || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nombre || !telefono) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    const data = {
      nombre,
      telefono,
      cantidad: cantidad ? parseInt(cantidad) : null,
    };

    setLoading(true);

    try {
      if (isEditing) {
        const res = await axios.put(`${API_URL}/instituciones/${institution.id_institucion}`, data);
        console.log('Respuesta PUT:', res.data);
      } else {
        const res = await axios.post(`${API_URL}/instituciones/`, data);
        console.log('Respuesta POST:', res.data);
      }
      navigation.goBack();
      Alert.alert('Éxito', `Institución ${isEditing ? 'actualizada' : 'creada'} correctamente`);
    } catch (error) {
      console.error('Error al guardar institución:', error.response?.data || error.message);
      Alert.alert('Error', `No se pudo ${isEditing ? 'editar' : 'crear'} la institución`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Editar Institución' : 'Nueva Institución'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la institución"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Cantidad de dispositivos (opcional)"
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
        </Text>
      </TouchableOpacity>
    </View>
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
  submitButton: {
    backgroundColor: '#11A140',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});