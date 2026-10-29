import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rivals Counter</Text>
      <TextInput placeholder="E-mail" placeholderTextColor="#888" style={styles.input} />
      <TextInput placeholder="Senha" placeholderTextColor="#888" secureTextEntry style={styles.input} />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('HeroesList')}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0b0f1a' },
  title: { fontSize: 28, color: '#e62429', textAlign: 'center', marginBottom: 32, fontWeight: 'bold' },
  input: { backgroundColor: '#1c2333', color: '#fff', padding: 14, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#e62429', padding: 16, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});