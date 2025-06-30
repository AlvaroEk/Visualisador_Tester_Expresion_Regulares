import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegexTesterScreen } from '../presentation/screens/pages/RegexTesterScreen';
import { HistoryScreen } from '../presentation/screens/pages/HistoryScreen';

export type RootStackParamList = {
  RegexTester: { pattern: string; flags: string } | undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="RegexTester">
      <Stack.Screen
        name="RegexTester"
        component={RegexTesterScreen}
        options={{ title: 'Visualizador de Expresiones Regulares' }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Historial de Expresiones' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
