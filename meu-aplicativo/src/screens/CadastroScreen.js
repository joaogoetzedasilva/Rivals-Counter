import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Modal } from 'react-native';
import { API_URL } from '../services/api';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function cadastrar() {
    if (!nome || !email || !senha) {
      setMensagem('Preencha todos os campos.');
      setModalVisible(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem('Conta criada com sucesso! Faça login.');
        setModalVisible(true);
      } else {
        setMensagem(data.error || 'Erro ao cadastrar.');
        setModalVisible(true);
      }
    } catch (error) {
      setMensagem('Falha na conexão.');
      setModalVisible(true);
    }
  }

  function fecharModal() {
    setModalVisible(false);
    if (mensagem.includes('sucesso')) {
      navigation.goBack(); // Volta para a tela de Login
    }
  }

  return (
    <ImageBackground 
      source={require('../../assets/bg-herois.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>CRIAR CONTA</Text>
        
        <View style={styles.formContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Nome completo" 
            placeholderTextColor="#aaa" 
            value={nome} 
            onChangeText={setNome} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="E-mail" 
            placeholderTextColor="#aaa" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address" 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Senha" 
            placeholderTextColor="#aaa" 
            secureTextEntry 
            value={senha} 
            onChangeText={setSenha} 
          />
          
          <TouchableOpacity style={styles.button} onPress={cadastrar}>
            <Text style={styles.buttonText}>CADASTRAR</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkButton}>
            <Text style={styles.linkText}>Já tem conta? Faça Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Feedback */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{mensagem.includes('sucesso') ? 'Sucesso!' : 'Aviso'}</Text>
            <Text style={{ color: '#ccc', textAlign: 'center', marginBottom: 20 }}>{mensagem}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={fecharModal}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: 'rgba(11, 15, 26, 0.6)', // Escurece a imagem
  },
  title: {
    fontSize: 32,
    color: '#e62429',
    textAlign: 'center',
    marginBottom: 30,
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
    elevation: 5,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1c2333',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e62429',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#e62429',
    padding: 12,
    borderRadius: 8,
  },
});