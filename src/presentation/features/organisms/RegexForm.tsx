import React from 'react';
import { View, Text } from 'react-native';
import { InputWithLabel } from '../molecules/InputWithLabel';

interface Props {
  inputText: string;
  pattern: string;
  flags: string;
  onInputChange: (text: string) => void;
  onPatternChange: (text: string) => void;
  onFlagsChange: (text: string) => void;
  flagError?: string;
}

export const RegexForm = ({
  inputText,
  pattern,
  flags,
  onInputChange,
  onPatternChange,
  onFlagsChange,
  flagError,
}: Props) => (
  <View>
    <InputWithLabel label="Texto de entrada" value={inputText} onChange={onInputChange} />
    <InputWithLabel label="Expresión regular" value={pattern} onChange={onPatternChange} />
    <InputWithLabel label="Flags" value={flags} onChange={onFlagsChange} placeholder="e.g. gmi" />
    {flagError ? (
      <Text style={{ color: 'red', marginTop: 4 }}>{flagError}</Text>
    ) : null}
  </View>
);
