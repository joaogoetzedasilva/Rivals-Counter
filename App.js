import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import HeroesListScreen from './src/screens/HeroesListScreen';
import HeroDetailScreen from './src/screens/HeroDetailScreen';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}