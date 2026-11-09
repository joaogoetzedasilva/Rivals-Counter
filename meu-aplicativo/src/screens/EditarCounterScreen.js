import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { fetchComToken } from '../services/api';

export default function EditarCounterScreen({ route, navigation }) {
  const { counterId, counterHeroId, dicaAtual } = route.params;
  const [dica, setDica] = useState(dicaAtual);
  const [novoCounterId, setNovoCounterId] = useState(String(counterHeroId));

  async function salvar() {
    try {
      const res = await fetchComToken(`/counters/${counterId}`, {
        method: 'PUT',
        body: JSON.stringify({ counter_hero_id: parseInt(novoCounterId), dica_tatica: dica })
      });
      if (res.ok) {
        Alert.alert('Sucesso', 'Counter atualizado!');
        navigation.goBack();
      }
    } catch (error) { Alert.alert('Erro', 'Falha na conexão.'); }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Counter</Text>
      <TextInput style={styles.input} placeholder="ID do Herói" placeholderTextColor="#888" keyboardType="numeric" value={novoCounterId} onChangeText={setNovoCounterId} />
      <TextInput style={styles.input} placeholder="Dica Tática" placeholderTextColor="#888" value={dica} onChangeText={setDica} />
      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f1a', padding: 24, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#1c2333', color: '#fff', padding: 14, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#e62429', padding: 16, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});