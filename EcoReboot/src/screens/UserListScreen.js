import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getUsers } from '../api/api';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuarios</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id_usuario.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userName}>{item.nombre}</Text>
            <Text style={styles.userDetails}>{item.telefono}</Text>
            <Text style={styles.userDetails}>{item.correo}</Text>
            <Text style={styles.userDetails}>Rol: {item.rol?.nombre}</Text>
          </View>
        )}
      />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FFF8', 
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userItem: {
    backgroundColor: '#f9c2ff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    fontSize: 16,
    color: '#333',
  },
});

export default UserListScreen;