import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FLAG_OPTIONS = ['g', 'i', 'm', 's', 'u', 'y'];

interface Props {
  selectedFlags: string;
  onChange: (newFlags: string) => void;
  invalidFlags?: string[];
  dark?: boolean;
}

export const FlagSelector = ({ selectedFlags, onChange, invalidFlags = [], dark = false }: Props) => {
  const toggleFlag = (flag: string) => {
    const set = new Set(selectedFlags.split(''));
    if (set.has(flag)) {
      set.delete(flag);
    } else {
      set.add(flag);
    }
    onChange([...set].join(''));
  };

  return (
    <View style={styles.container}>
      {FLAG_OPTIONS.map((flag) => {
        const active = selectedFlags.includes(flag);
        const invalid = invalidFlags.includes(flag);

        return (
          <TouchableOpacity
            key={flag}
            onPress={() => toggleFlag(flag)}
            style={[
              styles.chip,
              active && styles.chipActive,
              invalid && styles.chipInvalid,
              dark && styles.chipDark,
            ]}
          >
            <Text
              style={[
                styles.text,
                active && styles.textActive,
                invalid && styles.textInvalid,
                dark && styles.textDark,
              ]}
            >
              {flag}
            </Text>
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
    marginVertical: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#888',
    margin: 4,
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#4caf50',
    borderColor: '#388e3c',
  },
  chipDark: {
    backgroundColor: '#333',
    borderColor: '#777',
  },
  chipInvalid: {
    backgroundColor: '#ffcccc',
    borderColor: '#ff4444',
  },
  text: {
    color: '#444',
    fontWeight: 'bold',
  },
  textActive: {
    color: '#fff',
  },
  textInvalid: {
    color: '#900',
  },
  textDark: {
    color: '#ddd',
  },
});
