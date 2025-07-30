// src/screens/DonationFormScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

// Simulamos que el usuario está logueado (en tu caso, deberás obtenerlo del contexto o AsyncStorage)
const userId = 3; // ← Reemplaza con el ID real del usuario logueado

export default function DonationFormScreen({ navigation }) {
  const [telefono, setTelefono] = useState('');
  const [imperfecciones, setImperfecciones] = useState('');
  const [totalDispositivos, setTotalDispositivos] = useState('');
  const [idTipo, setIdTipo] = useState('1'); // Laptop
  const [idEstado, setIdEstado] = useState('1'); // Funcional

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

  const handleSubmit = async () => {
    if (!telefono || !totalDispositivos) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    const donacionData = {
      id_tipo_electrodomestico: parseInt(idTipo),
      id_estado_dispositivo: parseInt(idEstado),
      fecha: new Date().toISOString(), // Fecha actual
      imperfecciones: imperfecciones || null,
      telefono,
      total_dispositivos: parseInt(totalDispositivos),
    };

    try {
      // Aquí iría la llamada a tu API
      console.log('Enviando donación:', donacionData);

      // Simulamos éxito
      Alert.alert('Éxito', 'Donación registrada correctamente');
      navigation.goBack(); // Volver a la lista
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la donación');
      console.error(error);
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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Registrar Donación</Text>
      </TouchableOpacity>
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