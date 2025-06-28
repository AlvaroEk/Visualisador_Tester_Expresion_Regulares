import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  selectedFlags: string;
  onChange: (flags: string) => void;
  invalidFlags?: string[];
  dark?: boolean;
}

const FLAGS = ['g', 'i', 'm', 's', 'u', 'y'];

export const FlagSelector = ({ selectedFlags, onChange, invalidFlags = [], dark = false }: Props) => {
  const toggleFlag = (flag: string) => {
    const index = selectedFlags.indexOf(flag);
    const updated =
      index === -1
        ? selectedFlags + flag
        : selectedFlags.slice(0, index) + selectedFlags.slice(index + 1);
    onChange(updated);
  };

  return (
    <View style={styles.container}>
      {FLAGS.map((flag) => {
        const selected = selectedFlags.includes(flag);
        const invalid = invalidFlags.includes(flag);

        const backgroundColor = selected
          ? dark
            ? '#2196f3' // Azul vivo en modo oscuro
            : '#007bff' // Azul más suave en claro
          : dark
          ? '#444'
          : '#eee';

        const color = selected
          ? '#fff'
          : dark
          ? '#ccc'
          : '#000';

        return (
          <TouchableOpacity
            key={flag}
            onPress={() => toggleFlag(flag)}
            style={[styles.flag, { backgroundColor, borderColor: invalid ? 'red' : 'transparent' }]}
          >
            <Text style={[styles.flagText, { color }]}>{flag}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  flag: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  flagText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
