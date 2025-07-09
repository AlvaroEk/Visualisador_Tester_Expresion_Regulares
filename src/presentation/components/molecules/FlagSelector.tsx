import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface Props {
  selectedFlags: string;
  onChange: (flags: string) => void;
  invalidFlags?: string[];
  dark?: boolean;
}

// Lista de banderas válidas para expresiones regulares en JS
const VALID_FLAGS = ['g', 'i', 'm', 's', 'u', 'y'];

export const FlagSelector = ({
  selectedFlags,
  onChange,
  dark = false,
}: Props) => {
  // Maneja cambios en el campo de texto, permitiendo solo letras válidas y únicas
  const handleChange = (text: string) => {
    const filtered = text
      .split('')
      .filter((char, index, arr) =>
        VALID_FLAGS.includes(char) && arr.indexOf(char) === index
      )
      .join('');

    onChange(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: dark ? '#333' : '#fff',
            color: dark ? '#fff' : '#000',
            borderColor: dark ? '#666' : '#ccc',
          },
        ]}
        value={selectedFlags}
        onChangeText={handleChange}
        placeholder="Banderas (gimsuy)"
        placeholderTextColor={dark ? '#888' : '#999'}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={6} // máximo número de flags únicas
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 16,
  },
});
