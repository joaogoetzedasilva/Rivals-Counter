import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { fetchComToken } from '../services/api';

export default function CadastrarCounterScreen({ route, navigation }) {
  // PROTEÇÃO: Se route.params não existir, define um objeto vazio para não quebrar o app
  const params = route.params || {};
  const { heroId } = params; 

  const [counterHeroId, setCounterHeroId] = useState('');
  const [counterHeroNome, setCounterHeroNome] = useState('');
  const [dica, setDica] = useState('');
  
  const [herois, setHerois] = useState([]);
  const [modalListaVisible, setModalListaVisible] = useState(false);
  
  const [modalFeedback, setModalFeedback] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    async function carregarHerois() {
      try {
        const res = await fetchComToken('/herois');
        const data = await res.json();
        setHerois(data);
      } catch (error) {
        console.error("Erro ao carregar heróis:", error);
      }
    }
    carregarHerois();
  }, []);

  function selecionarHeroi(heroi) {
    setCounterHeroId(heroi.id.toString());
    setCounterHeroNome(heroi.nome);
    setModalListaVisible(false);
  }

  async function salvar() {
    if (!heroId) {
      setMensagem('Erro: Herói de origem não identificado. Volte e tente novamente.');
      setModalFeedback(true);
      return;
    }
    if (!counterHeroId || !dica) {
      setMensagem('Selecione um herói e preencha a dica.');
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
    if (mensagem.includes('sucesso')) {
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Counter</Text>
      
      <TouchableOpacity style={styles.inputSelector} onPress={() => setModalListaVisible(true)}>
        <Text style={{ color: counterHeroNome ? '#fff' : '#888' }}>
          {counterHeroNome || "Selecione o Herói Counter..."}
        </Text>
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Dica Tática" placeholderTextColor="#888" value={dica} onChangeText={setDica} />
      
      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <Modal visible={modalListaVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalListContent}>
            <Text style={styles.modalTitle}>Selecione o Herói</Text>
            <FlatList
              data={herois}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.heroItem} onPress={() => selecionarHeroi(item)}>
                  <Text style={styles.heroName}>{item.nome}</Text>
                  <Text style={styles.heroRole}>{item.funcao}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalListaVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  inputSelector: { backgroundColor: '#1c2333', padding: 14, borderRadius: 8, marginBottom: 12, justifyContent: 'center' },
  button: { backgroundColor: '#e62429', padding: 16, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#1c2333', borderRadius: 12, padding: 20 },
  modalListContent: { width: '90%', height: '70%', backgroundColor: '#1c2333', borderRadius: 12, padding: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  heroItem: { backgroundColor: '#0b0f1a', padding: 16, borderRadius: 8, marginBottom: 10 },
  heroName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  heroRole: { color: '#e62429', fontSize: 14, marginTop: 4 },
  cancelButton: { backgroundColor: '#0b0f1a', padding: 16, borderRadius: 8, marginTop: 10 },
});