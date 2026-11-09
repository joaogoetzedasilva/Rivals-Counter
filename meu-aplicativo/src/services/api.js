import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://localhost:3000';

// Função que busca o token salvo e envia em todas as requisições
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