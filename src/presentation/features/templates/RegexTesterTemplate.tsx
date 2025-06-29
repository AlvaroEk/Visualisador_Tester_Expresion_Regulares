import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  Button,
  View,
  StyleSheet,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../../store/themeStore';
import { Colors } from '../../theme/colors';

import { RegexForm } from '../organisms/RegexForm';
import { ASTTree } from '../organisms/ASTTree';
import { MatchHighlight } from '../atoms/MatchHighlight';
import { RegexHistoryList } from '../organisms/RegexHistoryList';
import { HighlightedText } from '../atoms/HighlightedText';
import ThemeToggle from '../components/molecules/ThemeToggle';

export const RegexTesterTemplate = observer(({
  inputText,
  pattern,
  flags,
  matches,
  ast,
  onInputChange,
  onPatternChange,
  onFlagsChange,
  flagError,
  indices,
}: any) => {
  const [showHistory, setShowHistory] = useState(false);
  const isDark = themeStore.resolvedMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <ScrollView
      style={[styles.wrapper, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Selector de tema */}
      <ThemeToggle />

      {/* Formulario principal */}
      <RegexForm
        inputText={inputText}
        pattern={pattern}
        flags={flags}
        onInputChange={onInputChange}
        onPatternChange={onPatternChange}
        onFlagsChange={onFlagsChange}
        flagError={flagError}
      />

      {/* Botón de historial */}
      <View style={styles.section}>
        <Button
          title={showHistory ? 'Ocultar historial' : 'Mostrar historial'}
          onPress={() => setShowHistory(!showHistory)}
          color={theme.chipActive}
        />
      </View>

      {/* Historial */}
      {showHistory && (
        <RegexHistoryList
          onSelect={({ pattern, flags }) => {
            onPatternChange(pattern);
            onFlagsChange(flags);
          }}
        />
      )}

      {/* Texto con coincidencias */}
      <Text style={[styles.heading, { color: theme.text }]}>
        Texto con Coincidencias:
      </Text>

      <HighlightedText text={inputText} indices={indices ?? []} />

      <Text style={[styles.countText, { color: theme.secondaryText }]}>
        Total de coincidencias: {matches?.length ?? 0}
      </Text>

      {/* Solo mostrar resultados si hay coincidencias */}
      {matches?.length > 0 && (
        <>
          <Text style={[styles.resultText, { color: theme.text }]}>
            Resultados:
          </Text>
          {matches.map((m: string, i: number) => (
            <MatchHighlight key={i} match={m} />
          ))}
        </>
      )}

      {/* AST Tree */}
      {ast && <ASTTree ast={ast} textColor={theme.text} />}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginVertical: 10,
  },
  heading: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  countText: {
    marginVertical: 10,
    fontSize: 14,
  },
  resultText: {
    marginVertical: 10,
    fontSize: 15,
    fontWeight: '600',
  },
});
