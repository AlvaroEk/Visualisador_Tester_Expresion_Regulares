import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { themeStore, ThemeMode } from '../../../store/themeStore';

const options: ThemeMode[] = ['system', 'light', 'dark'];

export const ThemeSelector = observer(() => {
  const current = themeStore.mode;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>🌗 Modo de tema:</Text>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          onPress={() => themeStore.setMode(opt)}
          style={[
            styles.button,
            current === opt && styles.activeButton
          ]}
        >
          <Text style={current === opt ? styles.activeText : styles.text}>
            {opt === 'system' ? 'Automático' : opt === 'light' ? 'Claro' : 'Oscuro'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingBottom: 24,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
  activeButton: {
    backgroundColor: '#4caf50',
  },
  text: {
    color: '#333',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
