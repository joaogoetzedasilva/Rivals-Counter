import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { API_URL } from '../services/api';

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

  // Recarrega a lista sempre que a tela volta a ficar visível (ex: após cadastrar)
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
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('HeroDetail', { heroId: item.id, heroName: item.nome })}
          >
            <Text style={styles.name}>{item.nome}</Text>
            <Text style={styles.role}>{item.funcao}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f1a', padding: 16 },
  addButton: { backgroundColor: '#e62429', padding: 14, borderRadius: 8, marginBottom: 16 },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: '#1c2333', padding: 16, borderRadius: 10, marginBottom: 10 },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  role: { color: '#e62429', marginTop: 4, fontWeight: 'bold' },
});