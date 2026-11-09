import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchComToken } from '../services/api';

export default function HeroDetailScreen({ route, navigation }) {
  const { heroId, heroName } = route.params;
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [counterSelecionado, setCounterSelecionado] = useState(null);

  async function carregarCounters() {
    setLoading(true);
    const userStr = await AsyncStorage.getItem('@rivals_user');
    if (userStr) setUsuario(JSON.parse(userStr));

    try {
      const response = await fetchComToken(`/herois/${heroId}/counters`);
      const data = await response.json();
      
      // Verifica se a resposta é um array antes de setar (proteção contra erros da API)
      if (Array.isArray(data)) {
        setCounters(data);
      } else {
        setCounters([]);
      }
    } catch (error) {
      console.error("Erro detalhado:", error);
      Alert.alert('Erro', 'Não foi possível carregar os counters.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarCounters();
    });
    return unsubscribe;
  }, [navigation, heroId]);

  function abrirOpcoes(counter) {
    setCounterSelecionado(counter);
    setModalVisible(true);
  }

  async function excluirCounter() {
    setModalVisible(false);
    Alert.alert('Excluir', 'Tem certeza que deseja excluir este counter?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sim', onPress: async () => {
          await fetchComToken(`/counters/${counterSelecionado.id}`, { method: 'DELETE' });
          carregarCounters();
      }}
    ]);
  }

  function editarCounter() {
    setModalVisible(false);
    navigation.navigate('EditarCounter', { 
      counterId: counterSelecionado.id, 
      heroId, 
      heroName, 
      counterHeroId: counterSelecionado.counter_hero_id, 
      dicaAtual: counterSelecionado.dica_tatica 
    });
  }

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#e62429" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Counters para {heroName}</Text>
        {usuario?.nivel === 'admin' && (
          <TouchableOpacity 
            style={styles.addIconButton} 
            onPress={() => navigation.navigate('CadastrarCounter', { heroId, heroName })}
          >
            <Ionicons name="add-circle" size={32} color="#e62429" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={counters}
        // CORRIGIDO AQUI: Protege contra item.id ser undefined
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        ListEmptyComponent={<Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>Nenhum counter cadastrado para este herói.</Text>}
        renderItem={({ item }) => (
          <View style={styles.counterCard}>
            <View style={styles.cardInfo}>
              <Text style={styles.counterName}>{item.counter_nome} ({item.counter_funcao})</Text>
              <Text style={styles.tip}>{item.dica_tatica}</Text>
            </View>
            
            {usuario?.nivel === 'admin' && (
              <TouchableOpacity style={styles.optionsButton} onPress={() => abrirOpcoes(item)}>
                <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Counter: {counterSelecionado?.counter_nome}</Text>
            
            <TouchableOpacity style={styles.modalButton} onPress={editarCounter}>
              <Ionicons name="pencil" size={20} color="#3b82f6" />
              <Text style={styles.modalButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={excluirCounter}>
              <Ionicons name="trash" size={20} color="#e62429" />
              <Text style={styles.modalButtonText}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f1a', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', flex: 1 },
  addIconButton: { padding: 4 },
  counterCard: { backgroundColor: '#1c2333', padding: 14, borderRadius: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardInfo: { flex: 1, paddingRight: 10 },
  counterName: { color: '#e62429', fontSize: 17, fontWeight: 'bold' },
  tip: { color: '#ccc', marginTop: 6, lineHeight: 20 },
  optionsButton: { padding: 8, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#1c2333', borderRadius: 12, padding: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0b0f1a', padding: 15, borderRadius: 8, marginBottom: 10, gap: 10 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { marginTop: 10, padding: 15, borderRadius: 8, backgroundColor: '#e62429' },
  cancelButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});