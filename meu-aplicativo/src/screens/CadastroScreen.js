import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      
      <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#888" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#888" secureTextEntry value={senha} onChangeText={setSenha} />
      
      <TouchableOpacity style={styles.button} onPress={cadastrar}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Já tem conta? Faça Login</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{mensagem.includes('sucesso') ? 'Sucesso!' : 'Aviso'}</Text>
            <Text style={{ color: '#ccc', textAlign: 'center', marginBottom: 20 }}>{mensagem}</Text>
            <TouchableOpacity style={styles.button} onPress={fecharModal}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0b0f1a' },
  title: { fontSize: 28, color: '#e62429', textAlign: 'center', marginBottom: 32, fontWeight: 'bold' },
  input: { backgroundColor: '#1c2333', color: '#fff', padding: 14, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#e62429', padding: 16, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#1c2333', borderRadius: 12, padding: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});