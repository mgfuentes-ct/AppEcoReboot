// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { API_URL } from '../api/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      // 🔥 Llamada a tu API FastAPI
      const response = await axios.post(`${API_URL}/login`, {
        correo,
        password,
      });

      const { id_usuario, nombre, rol } = response.data;

      // ✅ Guardar datos del usuario en AsyncStorage
      await AsyncStorage.setItem('userToken', 'loggedin'); // Token simple
      await AsyncStorage.setItem('userId', id_usuario.toString());
      await AsyncStorage.setItem('userName', nombre);
      await AsyncStorage.setItem('userRole', rol?.nombre || 'Usuario');

      Alert.alert('Éxito', `Bienvenido, ${nombre}`);
      navigation.replace('Home');
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        Alert.alert('Error', 'Correo o contraseña incorrectos');
      } else {
        Alert.alert('Error', 'No se pudo conectar con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
        autoComplete="email"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
        autoComplete="password"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#11A140" style={styles.button} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FFF8',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11A140',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  button: {
    backgroundColor: '#11A140',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#11A140',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
});

