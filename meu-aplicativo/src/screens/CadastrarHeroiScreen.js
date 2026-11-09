import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { fetchComToken } from '../services/api';

export default function CadastrarHeroiScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function salvarHeroi() {
    if (!nome || !funcao) return Alert.alert('Erro', 'Preencha todos os campos.');
    setEnviando(true);
    try {
      const resposta = await fetchComToken('/herois', {
        method: 'POST',
        body: JSON.stringify({ nome, funcao })
      });
      
      if (resposta.status === 201) {
        Alert.alert('Sucesso', 'Herói cadastrado!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Apenas administradores podem cadastrar heróis.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na conexão.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Herói</Text>
      <TextInput style={styles.input} placeholder="Nome do Herói" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Função (Vanguard, Duelist...)" placeholderTextColor="#888" value={funcao} onChangeText={setFuncao} />
      <TouchableOpacity style={styles.button} onPress={salvarHeroi} disabled={enviando}>
        <Text style={styles.buttonText}>{enviando ? 'Salvando...' : 'Cadastrar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f1a', padding: 24, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#1c2333', color: '#fff', padding: 14, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#e62429', padding: 16, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});