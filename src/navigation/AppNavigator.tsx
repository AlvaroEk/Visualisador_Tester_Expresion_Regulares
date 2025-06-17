import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegexTesterScreen } from '../presentation/features/pages/RegexTesterScreen';

export type RootStackParamList = {
  RegexTester: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RegexTester">
        <Stack.Screen
          name="RegexTester"
          component={RegexTesterScreen}
          options={{ title: 'Visualizador de Expresiones Regulares' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
