import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface Props {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export const InputText = ({ value, onChange, placeholder }: Props) => (
  <TextInput
    style={styles.input}
    value={value}
    onChangeText={onChange}
    placeholder={placeholder}
    autoCapitalize="none"
    autoCorrect={false}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
});
