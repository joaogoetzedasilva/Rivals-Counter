import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { fetchComToken } from '../services/api';

export default function CadastrarCounterScreen({ route, navigation }) {
  const { heroId } = route.params;
  const [counterHeroId, setCounterHeroId] = useState('');
  const [dica, setDica] = useState('');
  
  // Controle do Modal de Feedback
  const [modalFeedback, setModalFeedback] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function salvar() {
    if (!counterHeroId || !dica) {
      setMensagem('Preencha todos os campos.');
      setModalFeedback(true);
      return;
    }
    
    try {
      const res = await fetchComToken('/counters', {
        method: 'POST',
        body: JSON.stringify({ hero_id: heroId, counter_hero_id: parseInt(counterHeroId), dica_tatica: dica })
      });
      
      if (res.status === 201) {
        setMensagem('Counter adicionado com sucesso!');
        setModalFeedback(true);
      } else {
        const data = await res.json();
        setMensagem(data.error || 'Falha ao adicionar.');
        setModalFeedback(true);
      }
    } catch (error) {
      setMensagem('Falha na conexão.');
      setModalFeedback(true);
    }
  }

  function fecharModal() {
    setModalFeedback(false);
    // Se a mensagem foi de sucesso, volta para a lista
    if (mensagem.includes('sucesso')) {
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Counter</Text>
      <TextInput style={styles.input} placeholder="ID do Herói Counter (ex: 4)" placeholderTextColor="#888" keyboardType="numeric" value={counterHeroId} onChangeText={setCounterHeroId} />
      <TextInput style={styles.input} placeholder="Dica Tática" placeholderTextColor="#888" value={dica} onChangeText={setDica} />
      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <Modal visible={modalFeedback} transparent animationType="fade">
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
  container: { flex: 1, backgroundColor: '#0b0f1a', padding: 24, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#1c2333', color: '#fff', padding: 14, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#e62429', padding: 16, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#1c2333', borderRadius: 12, padding: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});