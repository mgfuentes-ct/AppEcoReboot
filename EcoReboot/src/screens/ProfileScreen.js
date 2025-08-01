import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName');
      const userCorreo = await AsyncStorage.getItem('userCorreo') || await AsyncStorage.getItem('correo');
      const userTelefono = await AsyncStorage.getItem('userTelefono') || await AsyncStorage.getItem('telefono');
      const userRole = await AsyncStorage.getItem('userRole') || 'Usuario';

      if (userId) {
        setUser({
          id: userId,
          nombre: userName || 'Sin nombre',
          correo: userCorreo || 'No disponible',
          telefono: userTelefono || 'No disponible',
          rol: userRole,
        });
      } else {
        Alert.alert('Error', 'No hay sesión activa');
        navigation.replace('Welcome');
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      Alert.alert('Error', 'No se pudieron cargar tus datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadUserData);
    if (!user) loadUserData();
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, cerrar',
          style: 'destructive',
          async onPress() {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userId');
              await AsyncStorage.removeItem('userName');
              await AsyncStorage.removeItem('userCorreo');
              await AsyncStorage.removeItem('userTelefono');
              await AsyncStorage.removeItem('userRole');

              navigation.replace('Welcome');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#11A140" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        
        <Text style={styles.welcomeText}>Hola, {user?.nombre}</Text>
        <Text style={styles.roleText}>{user?.rol}</Text>
      </View>

      {/* Tarjeta de perfil */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información Personal</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{user?.nombre}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.value}>{user?.correo}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.value}>{user?.rol}</Text>
        </View>
      </View>

      {user?.rol === 'Administrador' && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('AdminDashboard')}
        >
          <Text style={styles.adminButtonText}>Panel de Administrador</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFF8',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#11A140',
  },
  roleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
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
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  adminButton: {
  backgroundColor: '#1976D2',
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 20,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});