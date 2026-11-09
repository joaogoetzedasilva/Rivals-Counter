import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Card({ title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{title}</Text>
      <Text style={styles.role}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1c2333', padding: 16, borderRadius: 10, marginBottom: 10 },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  role: { color: '#e62429', marginTop: 4, fontWeight: 'bold' },
});