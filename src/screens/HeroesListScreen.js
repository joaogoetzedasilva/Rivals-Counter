import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { API_URL } from '../services/api';
import Card from '../components/Card';

export default function HeroesListScreen({ navigation }) {
  const [herois, setHerois] = useState([]);
  const [loading, setLoading] = useState(true);

  function carregarHerois() {
    setLoading(true);
    fetch(`${API_URL}/herois`)
      .then(response => response.json())
      .then(data => {
        setHerois(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar heróis:", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    carregarHerois();
  }, []);

  // Recarrega a lista quando a tela volta a ficar visível
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarHerois();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#e62429" /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={herois}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('CadastrarHeroi')}
          >
            <Text style={styles.addButtonText}>+ Cadastrar Novo Herói</Text>
          </TouchableOpacity>
        }
        renderItem={({ item }) => (
          <Card 
            title={item.nome} 
            subtitle={item.funcao} 
            onPress={() => navigation.navigate('HeroDetail', { heroId: item.id, heroName: item.nome })} 
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f1a', padding: 16 },
  addButton: { backgroundColor: '#e62429', padding: 14, borderRadius: 8, marginBottom: 16 },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});