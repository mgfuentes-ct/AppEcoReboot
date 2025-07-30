// src/screens/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      
      <Image
        source={require('../img/logo-ecoreboot.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>Bienvenido a EcoReboot</Text>
      <Text style={styles.subtitle}>
        Reciclamos, reparamos y donamos dispositivos electrónicos para un futuro más sostenible.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.buttonTextSecondary}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FFF8',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#11A140',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11A140',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  buttonPrimary: {
    backgroundColor: '#11A140',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#11A140',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#11A140',
    fontSize: 16,
    fontWeight: '600',
  },
});