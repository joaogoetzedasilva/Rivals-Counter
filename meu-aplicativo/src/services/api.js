import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Lógica para descobrir a URL da API automaticamente
let API_URL = 'http://localhost:3000';

if (Platform.OS !== 'web' && Constants.expoConfig?.hostUri) {
  const host = Constants.expoConfig.hostUri.split(':')[0];
  API_URL = `http://${host}:3000`;
}

export { API_URL };

export async function fetchComToken(rota, opcoes = {}) {
  const token = await AsyncStorage.getItem('@rivals_token');
  
  return fetch(`${API_URL}${rota}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...opcoes.headers
    }
  });
}