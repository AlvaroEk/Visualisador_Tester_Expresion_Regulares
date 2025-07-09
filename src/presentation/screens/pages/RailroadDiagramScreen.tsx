import React from 'react';
// Importa componentes de interfaz nativos
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// Permite que el componente reaccione a cambios de MobX
import { observer } from 'mobx-react-lite';
// Hook de React Navigation para acceder a los parámetros de navegación
import { useRoute } from '@react-navigation/native';
// Tipado para los parámetros de navegación definidos en el stack
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
// Componente que renderiza el diagrama de ferrocarril
import RailroadDiagram from '../../components/organisms/RailroadDiagram';

// Define el tipo de ruta esperada para esta pantalla
type RailroadRouteProp = RouteProp<RootStackParamList, 'RailroadDiagram'>;

// Componente principal de la pantalla del diagrama de ferrocarril
const RailroadDiagramScreen = observer(() => {
  // Obtiene el patrón de expresión regular desde los parámetros de la navegación
  const route = useRoute<RailroadRouteProp>();
  const pattern = route.params?.pattern;

  // Si no se recibió un patrón, se muestra un mensaje de error
  if (!pattern) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se proporcionó una expresión regular.</Text>
      </View>
    );
  }

  return (
    // Scroll principal para permitir desplazamiento vertical si es necesario
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título de la pantalla */}
      <Text style={styles.title}>Diagrama de Ferrocarril</Text>
      {/* Muestra la expresión regular actual */}
      <Text style={styles.pattern}>{pattern}</Text>

      {/* Scroll horizontal que envuelve el diagrama completo */}
      <ScrollView horizontal>
        <RailroadDiagram pattern={pattern} />
      </ScrollView>
    </ScrollView>
  );
});

// Estilos utilizados por el componente
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fefefe', // Fondo blanco claro
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefefe',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pattern: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default RailroadDiagramScreen;
