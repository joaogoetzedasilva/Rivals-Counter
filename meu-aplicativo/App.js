import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HeroesListScreen from './src/screens/HeroesListScreen';
import HeroDetailScreen from './src/screens/HeroDetailScreen';
import CadastrarHeroiScreen from './src/screens/CadastrarHeroiScreen';
import EditarHeroiScreen from './src/screens/EditarHeroiScreen';
import CadastrarCounterScreen from './src/screens/CadastrarCounterScreen';
import EditarCounterScreen from './src/screens/EditarCounterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // Função de Logout
  async function sair(navigation) {
    await AsyncStorage.removeItem('@rivals_token');
    await AsyncStorage.removeItem('@rivals_user');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#1c2333' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar', headerShown: false }} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Criar Conta' }} />
        
        <Stack.Screen 
          name="HeroesList" 
          component={HeroesListScreen} 
          options={({ navigation }) => ({ 
            title: 'Heróis',
            headerRight: () => (
              <TouchableOpacity onPress={() => sair(navigation)} style={{ marginRight: 10 }}>
                <Text style={{ color: '#e62429', fontWeight: 'bold' }}>Sair</Text>
              </TouchableOpacity>
            )
          })} 
        />
        
        <Stack.Screen name="HeroDetail" component={HeroDetailScreen} options={{ title: 'Counters' }} />
        <Stack.Screen name="CadastrarHeroi" component={CadastrarHeroiScreen} options={{ title: 'Novo Herói' }} />
        <Stack.Screen name="EditarHeroi" component={EditarHeroiScreen} options={{ title: 'Editar Herói' }} />
        <Stack.Screen name="CadastrarCounter" component={CadastrarCounterScreen} options={{ title: 'Novo Counter' }} />
        <Stack.Screen name="EditarCounter" component={EditarCounterScreen} options={{ title: 'Editar Counter' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}