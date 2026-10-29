import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { heroes } from '../data/heroes';

export default function HeroDetailScreen({ route }) {
  const { heroId } = route.params;
  const hero = heroes.find((h) => h.id === heroId);

  if (!hero) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Herói não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counters para {hero.name}</Text>
      <FlatList
        data={hero.counters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.counterCard}>
            <Text style={styles.counterName}>{item.name}</Text>
            <Text style={styles.tip}>{item.tip}</Text>
          </View>
        )}
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