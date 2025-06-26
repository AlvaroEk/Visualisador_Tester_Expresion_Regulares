import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  dark?: boolean;
}

export const InputWithLabel = ({
  label,
  value,
  onChange,
  placeholder,
  dark = false,
}: Props) => {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, dark && styles.labelDark]}>{label}</Text>
      <TextInput
        style={[styles.input, dark && styles.inputDark]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={dark ? '#aaa' : '#888'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    color: '#333',
    fontWeight: 'bold',
  },
  labelDark: {
    color: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#222',
    color: '#fff',
    borderColor: '#555',
  },
});
