import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function fazerLogin() {
    if (!email || !senha) return alert('Preencha e-mail e senha.');
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
        navigation.navigate('SelecaoFuncao');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Falha na conexão.');
    } finally {
      setLoading(false);
    }
  }

  return (
    // AQUI ESTÁ A MÁGICA DO FUNDO
    <ImageBackground 
      source={require('../../assets/bg-herois.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>RIVALS COUNTER</Text>
        
        <View style={styles.formContainer}>
          <TextInput 
            placeholder="E-mail" 
            placeholderTextColor="#aaa" 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
          />
          <TextInput 
            placeholder="Senha" 
            placeholderTextColor="#aaa" 
            secureTextEntry 
            style={styles.input} 
            value={senha} 
            onChangeText={setSenha} 
          />
          
          <TouchableOpacity style={styles.button} onPress={fazerLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'ENTRAR'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={styles.linkButton}>
            <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(11, 15, 26, 0.6)', // Escurece a imagem para o texto aparecer
  },
  title: {
    fontSize: 36,
    color: '#e62429',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  formContainer: {
    backgroundColor: 'rgba(28, 35, 51, 0.85)', // Efeito de vidro escuro
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(230, 36, 41, 0.3)', // Borda vermelha sutil
  },
  input: {
    backgroundColor: 'rgba(11, 15, 26, 0.9)',
    color: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#e62429',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    shadowColor: '#e62429',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5, // Sombra no Android
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  }
});