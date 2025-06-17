import React from 'react';
import { View, Text } from 'react-native';
import { InputText } from '../atoms/InputText';

interface Props {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export const InputWithLabel = ({ label, value, onChange, placeholder }: Props) => (
  <View style={{ marginVertical: 6 }}>
    <Text>{label}</Text>
    <InputText value={value} onChange={onChange} placeholder={placeholder} />
  </View>
);
