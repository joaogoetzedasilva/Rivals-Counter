import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { fetchComToken } from '../services/api';

export default function CadastrarHeroiScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [enviando, setEnviando] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function salvarHeroi() {
    if (!nome || !funcao) {
      setMensagem('Preencha o nome e a função.');
      setModalVisible(true);
      return;
    }
    setEnviando(true);
    try {
      const resposta = await fetchComToken('/herois', {
        method: 'POST',
        body: JSON.stringify({ nome, funcao, foto_url: fotoUrl })
      });
      
      if (resposta.status === 201) {
        setMensagem('Herói cadastrado com sucesso!');
        setModalVisible(true);
      } else {
        setMensagem('Apenas administradores podem cadastrar heróis.');
        setModalVisible(true);
      }
    } catch (error) {
      setMensagem('Falha na conexão.');
      setModalVisible(true);
    } finally {
      setEnviando(false);
    }
  }

  function fecharModal() {
    setModalVisible(false);
    if (mensagem.includes('sucesso')) {
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Herói</Text>
      <TextInput style={styles.input} placeholder="Nome do Herói" placeholderTextColor="#888" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Função (Vanguard, Duelist...)" placeholderTextColor="#888" value={funcao} onChangeText={setFuncao} />
      
      {/* TEXTO ATUALIZADO PARA MOSTRAR QUE É OPCIONAL */}
      <TextInput 
        style={styles.input} 
        placeholder="URL da Foto (Opcional - deixe em branco para usar a padrão)" 
        placeholderTextColor="#888" 
        value={fotoUrl} 
        onChangeText={setFotoUrl} 
        autoCapitalize="none" 
      />
      
      <TouchableOpacity style={styles.button} onPress={salvarHeroi} disabled={enviando}>
        <Text style={styles.buttonText}>{enviando ? 'Salvando...' : 'Cadastrar'}</Text>
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
  container: { flex: 1, backgroundColor: '#0b0f1a', padding: 24, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#1c2333', color: '#fff', padding: 14, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#e62429', padding: 16, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#1c2333', borderRadius: 12, padding: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
});