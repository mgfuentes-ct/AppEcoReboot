import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { API_URL } from '../../api/config';
import axios from 'axios';

export default function UserFormScreen({ route, navigation }) {
  const { user } = route.params || {};
  const isEditing = !!user;

  const [nombre, setNombre] = useState(user?.nombre || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [correo, setCorreo] = useState(user?.correo || '');
  const [idRol, setIdRol] = useState(user?.id_rol_usuario?.toString() || '2');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nombre || !telefono || !correo || !idRol || (!isEditing && !contrasena)) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const userData = {
      nombre,
      telefono,
      correo,
      id_rol_usuario: parseInt(idRol),
      ...(isEditing ? {} : { contraseña: contrasena }), // solo agregar contraseña si es nuevo
    };

    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/usuarios/${user.id_usuario}`, userData);
      } else {
        await axios.post(`${API_URL}/usuarios/`, userData);
      }
      Alert.alert('Éxito', `Usuario ${isEditing ? 'actualizado' : 'creado'} correctamente`);
      navigation.goBack();
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Error', `No se pudo ${isEditing ? 'editar' : 'crear'} el usuario`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
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
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Campo de contraseña solo si es creación */}
      {!isEditing && (
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
          autoCapitalize="none"
        />
      )}

      <Text style={styles.label}>Rol</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={[styles.radioButton, idRol === '1' && styles.radioButtonSelected]}
          onPress={() => setIdRol('1')}
        >
          <Text style={[styles.radioText, idRol === '1' && styles.radioTextSelected]}>Administrador</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, idRol === '2' && styles.radioButtonSelected]}
          onPress={() => setIdRol('2')}
        >
          <Text style={[styles.radioText, idRol === '2' && styles.radioTextSelected]}>Usuario</Text>
        </TouchableOpacity>
      </View>

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
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radioButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#E8F5E8',
    borderColor: '#11A140',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  radioTextSelected: {
    color: '#11A140',
    fontWeight: 'bold',
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