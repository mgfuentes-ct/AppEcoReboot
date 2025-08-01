import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkIfAdmin = async () => {
  const role = await AsyncStorage.getItem('userRole2');
  return role === 'Administrador';
};