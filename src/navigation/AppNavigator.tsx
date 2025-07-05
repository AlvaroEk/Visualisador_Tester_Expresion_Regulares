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
// Importa la nueva pantalla de visualización del diagrama AST
import  ASTDiagramScreen  from '../presentation/screens/pages/ASTDiagramScreen';

// Tipado de los parámetros esperados por cada pantalla del stack
export type RootStackParamList = {
  // Pantalla principal del visualizador
  RegexTester: { pattern?: string; flags?: string } | undefined;
  // Pantalla del historial
  History: undefined;
  // Nueva pantalla para ver el diagrama AST
  ASTDiagram: {
    nodes: { id: string; label: string; x: number; y: number }[];
    connections: { from: string; to: string }[];
  };
};

// Crea el stack de navegación con tipado
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

      {/* Pantalla secundaria para ver el historial */}
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Historial de Expresiones' }}
      />

      {/* Pantalla visual del diagrama AST */}
      <Stack.Screen
        name="ASTDiagram"
        component={ASTDiagramScreen}
        options={{ title: 'Diagrama AST' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
