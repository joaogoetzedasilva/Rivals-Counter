import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { heroes } from '../data/heroes';

export default function HeroesListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={heroes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('HeroDetail', { heroId: item.id })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f1a', padding: 16 },
  card: { backgroundColor: '#1c2333', padding: 16, borderRadius: 10, marginBottom: 10 },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  role: { color: '#e62429', marginTop: 4, fontWeight: 'bold' },
});