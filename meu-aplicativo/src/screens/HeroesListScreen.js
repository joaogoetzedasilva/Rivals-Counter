import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchComToken } from '../services/api';

// URL DA FOTO PADRÃO
const FOTO_PADRAO = 'https://th.bing.com/th/id/OIP.WEfeyAPDfp4AaiHnadfTRwAAAA?w=165&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3';

export default function HeroesListScreen({ route, navigation }) {
  const { funcaoSelecionada } = route.params || { funcaoSelecionada: 'Todas' };

  const [secoes, setSecoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [heroiSelecionado, setHeroiSelecionado] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const titulosFuncoes = {
    'Vanguard': '🛡️ TANQUES (VANGUARD)',
    'Duelist': '⚔️ DANO (DUELIST)',
    'Strategist': '💚 SUPORTE (STRATEGIST)'
  };

  async function carregarDados() {
    setLoading(true);
    const userStr = await AsyncStorage.getItem('@rivals_user');
    if (userStr) setUsuario(JSON.parse(userStr));

    try {
      const response = await fetchComToken('/herois');
      let data = await response.json();
      
      if (funcaoSelecionada !== 'Todas') {
        data = data.filter(heroi => heroi.funcao === funcaoSelecionada);
      }

      data.sort((a, b) => a.nome.localeCompare(b.nome));

      const agrupado = data.reduce((acc, heroi) => {
        const titulo = titulosFuncoes[heroi.funcao] || 'Outros';
        if (!acc[titulo]) acc[titulo] = [];
        acc[titulo].push(heroi);
        return acc;
      }, {});

      const secoesFormatadas = Object.keys(agrupado).map(titulo => ({
        title: titulo,
        data: agrupado[titulo]
      }));

      const ordemSecoes = { '🛡️ TANQUES (VANGUARD)': 1, '⚔️ DANO (DUELIST)': 2, '💚 SUPORTE (STRATEGIST)': 3 };
      secoesFormatadas.sort((a, b) => (ordemSecoes[a.title] || 99) - (ordemSecoes[b.title] || 99));

      setSecoes(secoesFormatadas);
      
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    navigation.setOptions({ 
      title: funcaoSelecionada === 'Todas' ? 'Todos os Heróis' : `Heróis: ${funcaoSelecionada}` 
    });

    const unsubscribe = navigation.addListener('focus', () => {
      carregarDados();
    });
    return unsubscribe;
  }, [navigation, funcaoSelecionada]);

  function abrirOpcoes(heroi) {
    setHeroiSelecionado(heroi);
    setModalVisible(true);
  }

  function editarHeroi() {
    setModalVisible(false);
    navigation.navigate('EditarHeroi', { 
      heroId: heroiSelecionado.id, 
      nomeAtual: heroiSelecionado.nome, 
      funcaoAtual: heroiSelecionado.funcao,
      fotoAtual: heroiSelecionado.foto_url
    });
  }

  function pedirConfirmacaoExclusao() {
    setModalVisible(false);
    setModalConfirmVisible(true);
  }

  async function executarExclusao() {
    setExcluindo(true);
    try {
      const res = await fetchComToken(`/herois/${heroiSelecionado.id}`, { method: 'DELETE' });
      if (res.ok) {
        setModalConfirmVisible(false);
        carregarDados(); 
      } else {
        alert('Falha ao excluir.');
        setModalConfirmVisible(false);
      }
    } catch (err) {
      alert('Falha na conexão.');
      setModalConfirmVisible(false);
    } finally {
      setExcluindo(false);
    }
  }

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#e62429" /></View>;

  return (
    <View style={styles.container}>
      <SectionList
        sections={secoes}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={28} color="#e62429" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Bem-vindo ao Rivals Counter!</Text>
                <Text style={styles.infoText}>
                  Selecione um herói abaixo para ver quais personagens são fortes contra ele, com dicas táticas para dominar suas partidas.
                </Text>
              </View>
            </View>

            {usuario?.nivel === 'admin' && (
              <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CadastrarHeroi')}>
                <Text style={styles.addButtonText}>+ Cadastrar Novo Herói</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListEmptyComponent={
          <Text style={{ color: '#ccc', textAlign: 'center', marginTop: 20 }}>
            Nenhum herói encontrado.
          </Text>
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => navigation.navigate('HeroDetail', { heroId: item.id, heroName: item.nome })}
            >
              <View style={styles.cardContent}>
                {/* USA A FOTO CADASTRADA OU A PADRÃO */}
                <Image source={{ uri: item.foto_url || FOTO_PADRAO }} style={styles.heroImage} />
                <Text style={styles.name}>{item.nome}</Text>
                <Ionicons name="chevron-forward" size={20} color="#555" />
              </View>
            </TouchableOpacity>
            
            {usuario?.nivel === 'admin' && (
              <TouchableOpacity style={styles.optionsButton} onPress={() => abrirOpcoes(item)}>
                <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* MODAIS ... (Mantenha os modais originais aqui) */}
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
  headerContainer: { marginBottom: 10 },
  infoCard: { backgroundColor: 'rgba(28, 35, 51, 0.9)', flexDirection: 'row', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(230, 36, 41, 0.3)', marginBottom: 20, alignItems: 'center' },
  infoTextContainer: { flex: 1, marginLeft: 12 },
  infoTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  infoText: { color: '#bbb', fontSize: 14, lineHeight: 20 },
  addButton: { backgroundColor: '#e62429', padding: 14, borderRadius: 8, marginBottom: 16 },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  sectionHeader: { color: '#e62429', fontSize: 20, fontWeight: '900', marginTop: 10, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' },
  cardContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  card: { flex: 1, backgroundColor: '#1c2333', padding: 12, borderRadius: 10 },
  cardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: '#333' },
  name: { flex: 1, color: '#fff', fontSize: 18, fontWeight: 'bold' },
  optionsButton: { padding: 16, marginLeft: 8, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#1c2333', borderRadius: 12, padding: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0b0f1a', padding: 15, borderRadius: 8, marginBottom: 10, gap: 10 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { marginTop: 10, padding: 15, borderRadius: 8, backgroundColor: '#e62429' },
  cancelButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});