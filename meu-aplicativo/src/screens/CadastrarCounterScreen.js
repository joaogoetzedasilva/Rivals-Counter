import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { fetchComToken } from '../services/api';

export default function CadastrarCounterScreen({ route, navigation }) {
  const { heroId } = route.params;
  const [counterHeroId, setCounterHeroId] = useState('');
  const [dica, setDica] = useState('');

  async function salvar() {
    if (!counterHeroId || !dica) return Alert.alert('Erro', 'Preencha tudo.');
    try {
      const res = await fetchComToken('/counters', {
        method: 'POST',
        body: JSON.stringify({ hero_id: heroId, counter_hero_id: parseInt(counterHeroId), dica_tatica: dica })
      });
      if (res.status === 201) {
        Alert.alert('Sucesso', 'Counter adicionado!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', 'Falha ao adicionar.');
      }
    } catch (error) { Alert.alert('Erro', 'Falha na conexão.'); }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Counter</Text>
      <TextInput style={styles.input} placeholder="ID do Herói Counter (ex: 4)" placeholderTextColor="#888" keyboardType="numeric" value={counterHeroId} onChangeText={setCounterHeroId} />
      <TextInput style={styles.input} placeholder="Dica Tática" placeholderTextColor="#888" value={dica} onChangeText={setDica} />
      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar</Text>
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