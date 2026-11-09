import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas de Autenticação e Heróis
import LoginScreen from './src/screens/LoginScreen';
import HeroesListScreen from './src/screens/HeroesListScreen';
import HeroDetailScreen from './src/screens/HeroDetailScreen';
import CadastrarHeroiScreen from './src/screens/CadastrarHeroiScreen';
import EditarHeroiScreen from './src/screens/EditarHeroiScreen';

// Telas de Counters (AS QUE FALTAVAM)
import CadastrarCounterScreen from './src/screens/CadastrarCounterScreen';
import EditarCounterScreen from './src/screens/EditarCounterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
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
        <Stack.Screen name="HeroesList" component={HeroesListScreen} options={{ title: 'Heróis' }} />
        <Stack.Screen name="HeroDetail" component={HeroDetailScreen} options={{ title: 'Counters' }} />
        
        {/* Telas de Heróis */}
        <Stack.Screen name="CadastrarHeroi" component={CadastrarHeroiScreen} options={{ title: 'Novo Herói' }} />
        <Stack.Screen name="EditarHeroi" component={EditarHeroiScreen} options={{ title: 'Editar Herói' }} />

        {/* Telas de Counters */}
        <Stack.Screen name="CadastrarCounter" component={CadastrarCounterScreen} options={{ title: 'Novo Counter' }} />
        <Stack.Screen name="EditarCounter" component={EditarCounterScreen} options={{ title: 'Editar Counter' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}