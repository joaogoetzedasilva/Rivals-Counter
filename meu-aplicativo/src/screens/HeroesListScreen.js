import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchComToken } from '../services/api';

export default function HeroesListScreen({ navigation }) {
  const [herois, setHerois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  
  // Estados do Modal de Opções (3 pontinhos)
  const [modalVisible, setModalVisible] = useState(false);
  const [heroiSelecionado, setHeroiSelecionado] = useState(null);

  // Estados do Modal de Confirmação de Exclusão
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  async function carregarDados() {
    setLoading(true);
    const userStr = await AsyncStorage.getItem('@rivals_user');
    if (userStr) setUsuario(JSON.parse(userStr));

    try {
      const response = await fetchComToken('/herois');
      const data = await response.json();
      setHerois(data);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados();
    });
    return unsubscribe;
  }, [navigation]);

  function abrirOpcoes(heroi) {
    setHeroiSelecionado(heroi);
    setModalVisible(true);
  }

  function editarHeroi() {
    setModalVisible(false);
    navigation.navigate('EditarHeroi', { 
      heroId: heroiSelecionado.id, 
      nomeAtual: heroiSelecionado.nome, 
      funcaoAtual: heroiSelecionado.funcao 
    });
  }

  // Função para abrir o modal de confirmação
  function pedirConfirmacaoExclusao() {
    setModalVisible(false);
    setModalConfirmVisible(true);
  }

  // Função que realmente exclui
  async function executarExclusao() {
    setExcluindo(true);
    try {
      const res = await fetchComToken(`/herois/${heroiSelecionado.id}`, { method: 'DELETE' });
      
      if (res.ok) {
        setModalConfirmVisible(false); // Fecha o modal de confirmação
        carregarDados(); // Recarrega a lista
      } else {
        const data = await res.json();
        alert(data.error || 'Falha ao excluir.'); // Alerta simples da web/celular
        setModalConfirmVisible(false);
      }
    } catch (err) {
      console.log(err);
      alert('Falha na conexão com o servidor.');
      setModalConfirmVisible(false);
    } finally {
      setExcluindo(false);
    }
  }

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#e62429" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={herois}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          usuario?.nivel === 'admin' ? (
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CadastrarHeroi')}>
              <Text style={styles.addButtonText}>+ Cadastrar Novo Herói</Text>
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate('HeroDetail', { heroId: item.id, heroName: item.nome })}
            >
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.role}>{item.funcao}</Text>
            </TouchableOpacity>
            
            {usuario?.nivel === 'admin' && (
              <TouchableOpacity style={styles.optionsButton} onPress={() => abrirOpcoes(item)}>
                <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* MODAL 1: OPÇÕES DO HERÓI (3 pontinhos) */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ações para {heroiSelecionado?.nome}</Text>
            
            <TouchableOpacity style={styles.modalButton} onPress={editarHeroi}>
              <Ionicons name="pencil" size={20} color="#3b82f6" />
              <Text style={styles.modalButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={pedirConfirmacaoExclusao}>
              <Ionicons name="trash" size={20} color="#e62429" />
              <Text style={styles.modalButtonText}>Excluir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: CONFIRMAÇÃO DE EXCLUSÃO (Substitui o Alert.alert na Web) */}
      <Modal visible={modalConfirmVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tem certeza?</Text>
            <Text style={{ color: '#ccc', textAlign: 'center', marginBottom: 20 }}>
              Deseja realmente excluir {heroiSelecionado?.nome}?
            </Text>
            
            <TouchableOpacity style={styles.modalButton} onPress={executarExclusao} disabled={excluindo}>
              <Ionicons name="checkmark-circle" size={20} color="#e62429" />
              <Text style={styles.modalButtonText}>{excluindo ? 'Excluindo...' : 'Sim, excluir'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalConfirmVisible(false)}>
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
  addButton: { backgroundColor: '#e62429', padding: 14, borderRadius: 8, marginBottom: 16 },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  cardContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  card: { flex: 1, backgroundColor: '#1c2333', padding: 16, borderRadius: 10 },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  role: { color: '#e62429', marginTop: 4, fontWeight: 'bold' },
  optionsButton: { padding: 16, marginLeft: 8, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#1c2333', borderRadius: 12, padding: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0b0f1a', padding: 15, borderRadius: 8, marginBottom: 10, gap: 10 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { marginTop: 10, padding: 15, borderRadius: 8, backgroundColor: '#e62429' },
  cancelButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});