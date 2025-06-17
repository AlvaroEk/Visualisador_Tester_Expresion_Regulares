import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { RegexForm } from '../organisms/RegexForm';
import { ASTTree } from '../organisms/ASTTree';
import { MatchHighlight } from '../atoms/MatchHighlight';
import { RegexHistoryList } from '../organisms/RegexHistoryList';

export const RegexTesterTemplate = ({
  inputText,
  pattern,
  flags,
  matches,
  ast,
  onInputChange,
  onPatternChange,
  onFlagsChange,
}: any) => (
  <ScrollView contentContainerStyle={{ padding: 16 }}>
    <RegexForm
      inputText={inputText}
      pattern={pattern}
      flags={flags}
      onInputChange={onInputChange}
      onPatternChange={onPatternChange}
      onFlagsChange={onFlagsChange}
    />

    {/* Historial debajo del formulario */}
    <RegexHistoryList
      onSelect={({ pattern, flags }) => {
        onPatternChange(pattern);
        onFlagsChange(flags);
      }}
    />

    <Text style={{ marginVertical: 10 }}>Resultados:</Text>
    {matches?.map((m: string, i: number) => (
      <MatchHighlight key={i} match={m} />
    ))}

    {ast && <ASTTree ast={ast} />}
  </ScrollView>
);
