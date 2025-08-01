// src/screens/Admin/AdminDashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

export default function AdminDashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Panel de Administrador</Text>
      <Text style={styles.subtitle}>Gestiona usuarios del sistema</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('UserList')}
      >
        <Text style={styles.cardTitle}>Gestión de Usuarios</Text>
        <Text style={styles.cardText}>Ver, crear, editar y eliminar usuarios</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('InstitutionList')}
        >
        <Text style={styles.cardTitle}>Gestión de Instituciones</Text>
        <Text style={styles.cardText}>Ver, crear, editar y eliminar instituciones</Text>
    </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FFF8',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11A140',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 15,
    color: '#666',
  },
});