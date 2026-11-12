import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function fazerLogin() {
    if (!email || !senha) return Alert.alert('Erro', 'Preencha e-mail e senha.');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('@rivals_token', data.token);
        await AsyncStorage.setItem('@rivals_user', JSON.stringify(data.usuario));
        navigation.navigate('HeroesList');
      } else {
        alert(data.error); // Usando alert simples para funcionar na web
      }
    } catch (error) {
      alert('Falha na conexão.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rivals Counter</Text>
      <TextInput placeholder="E-mail" placeholderTextColor="#888" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Senha" placeholderTextColor="#888" secureTextEntry style={styles.input} value={senha} onChangeText={setSenha} />
      
      <TouchableOpacity style={styles.button} onPress={fazerLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      {/* BOTÃO DE CADASTRO AQUI */}
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={{ marginTop: 20 }}>
        <Text style={{ color: '#e62429', textAlign: 'center', fontWeight: 'bold' }}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0b0f1a' },
  title: { fontSize: 28, color: '#e62429', textAlign: 'center', marginBottom: 32, fontWeight: 'bold' },
  input: { backgroundColor: '#1c2333', color: '#fff', padding: 14, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#e62429', padding: 16, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});