import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SelecaoFuncaoScreen({ navigation }) {
  
  // Função para navegar para a lista passando a função escolhida como parâmetro
  function escolherFuncao(funcao) {
    navigation.navigate('HeroesList', { funcaoSelecionada: funcao });
  }

  return (
    <ImageBackground 
      source={require('../../assets/bg-herois.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>ESCOLHA SUA FUNÇÃO</Text>
        <Text style={styles.subtitle}>Qual classe você quer consultar?</Text>

        <View style={styles.buttonContainer}>
          {/* Botão Todas */}
          <TouchableOpacity style={styles.cardButton} onPress={() => escolherFuncao('Todas')}>
            <Ionicons name="apps" size={32} color="#fff" />
            <Text style={styles.cardText}>Todas as Classes</Text>
          </TouchableOpacity>

          {/* Botão Vanguard (Tanque) */}
          <TouchableOpacity style={styles.cardButton} onPress={() => escolherFuncao('Vanguard')}>
            <Ionicons name="shield-half" size={32} color="#3b82f6" />
            <Text style={styles.cardText}>Vanguard (Tanque)</Text>
          </TouchableOpacity>

          {/* Botão Duelist */}
          <TouchableOpacity style={styles.cardButton} onPress={() => escolherFuncao('Duelist')}>
            <Ionicons name="flash" size={32} color="#e62429" />
            <Text style={styles.cardText}>Duelist (Dano)</Text>
          </TouchableOpacity>

          {/* Botão Strategist */}
          <TouchableOpacity style={styles.cardButton} onPress={() => escolherFuncao('Strategist')}>
            <Ionicons name="medkit" size={32} color="#10b981" />
            <Text style={styles.cardText}>Strategist (Suporte)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'rgba(11, 15, 26, 0.7)', // Fundo escuro semi-transparente
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#e62429',
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 10,
  },
  subtitle: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 16,
  },
  cardButton: {
    backgroundColor: 'rgba(28, 35, 51, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  }
});