import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import RailroadDiagram from '../../components/organisms/RailroadDiagram';

type RailroadRouteProp = RouteProp<RootStackParamList, 'RailroadDiagram'>;

const RailroadDiagramScreen = observer(() => {
  const route = useRoute<RailroadRouteProp>();
  const pattern = route.params?.pattern;

  if (!pattern) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se proporcionó una expresión regular.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Diagrama de Ferrocarril</Text>
      <Text style={styles.pattern}>{pattern}</Text>

      {/* ENVUELVE EL DIAGRAMA EN UN SCROLLVIEW HORIZONTAL */}
      <ScrollView horizontal>
        <RailroadDiagram pattern={pattern} />
      </ScrollView>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fefefe',
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
