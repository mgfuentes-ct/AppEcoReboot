import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({
  baseURL: API_URL,
});

export const getUsers = async () => {
  try {
    const response = await api.get('/usuarios/');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getDonations = async () => {
  try {
    const response = await api.get('/donaciones/');
    return response.data;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

export const getDevices = async () => {
  try {
    const response = await api.get('/dispositivos/');
    return response.data;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};