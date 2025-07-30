// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración del Perfil</Text>
      <Text>Esta es la pantalla de configuración del perfil.</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11A140',
    marginBottom: 20,
  },
});