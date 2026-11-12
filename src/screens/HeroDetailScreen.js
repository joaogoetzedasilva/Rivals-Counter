import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { API_URL } from '../services/api';

export default function HeroDetailScreen({ route }) {
  const { heroId, heroName } = route.params;
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/herois/${heroId}/counters`)
      .then(response => response.json())
      .then(data => {
        setCounters(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar counters:", error);
        setLoading(false);
      });
  }, [heroId]);

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#e62429" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counters para {heroName}</Text>
      <FlatList
        data={counters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.counterCard}>
            <Text style={styles.counterName}>{item.counter_nome} ({item.counter_funcao})</Text>
            <Text style={styles.tip}>{item.dica_tatica}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.tip}>Nenhum counter cadastrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f1a', padding: 16 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  counterCard: { backgroundColor: '#1c2333', padding: 14, borderRadius: 10, marginBottom: 10 },
  counterName: { color: '#e62429', fontSize: 17, fontWeight: 'bold' },
  tip: { color: '#ccc', marginTop: 6, lineHeight: 20 },
});