// Importa React para usar JSX y componentes
import React from 'react';
// Importa el contenedor de navegación principal desde React Navigation
import { NavigationContainer } from '@react-navigation/native';
// Importa el creador de pila de navegación nativa (stack)
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Importa la pantalla principal donde se prueba la expresión regular
import { RegexTesterScreen } from '../presentation/screens/pages/RegexTesterScreen';
// Importa la pantalla del historial de expresiones regulares usadas
import { HistoryScreen } from '../presentation/screens/pages/HistoryScreen';

// Define los parámetros esperados por cada pantalla del stack de navegación
export type RootStackParamList = {
  // La pantalla RegexTester puede recibir un patrón y flags o estar indefinida
  RegexTester: { pattern: string; flags: string } | undefined;
  // La pantalla History no espera parámetros
  History: undefined;
};

// Crea una instancia del stack con los tipos definidos arriba
const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente que define la navegación principal de la app
export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="RegexTester">
      {/* Pantalla principal para visualizar expresiones regulares */}
      <Stack.Screen
        name="RegexTester"
        component={RegexTesterScreen}
        options={{ title: 'Visualizador de Expresiones Regulares' }}
      />
      {/* Pantalla secundaria que muestra el historial de expresiones */}
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Historial de Expresiones' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
