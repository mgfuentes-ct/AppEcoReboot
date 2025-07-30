// App.js
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native'; // ← Importa aquí
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer> {/* ✅ Obligatorio para que funcione React Navigation */}
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style="auto" backgroundColor="#11A140" />
    </SafeAreaProvider>
  );
}