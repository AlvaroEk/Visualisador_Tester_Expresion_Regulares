import React from 'react';
import {
  FlatList,
  Text,
  Button,
  View,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../../store/themeStore';
import { Colors } from '../../theme/colors';

import { RegexForm } from '../components/organisms/RegexForm';
import { ASTTree } from '../components/organisms/ASTTree';
import { MatchHighlight } from '../components/atoms/MatchHighlight';
import { HighlightedText } from '../components/atoms/HighlightedText';
import ThemeToggle from '../components/molecules/ThemeToggle';

interface Props {
  inputText: string;
  pattern: string;
  flags: string;
  matches: string[];
  indices: [number, number][];
  ast: any;
  flagError?: string;
  onInputChange: (text: string) => void;
  onPatternChange: (text: string) => void;
  onFlagsChange: (text: string) => void;
  onOpenHistory: () => void;
}

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
  onOpenHistory,
}: Props) => {
  const isDark = themeStore.resolvedMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  const renderItem: ListRenderItem<string> = ({ item, index }) => (
    <MatchHighlight key={index} match={item} />
  );

  return (
    <FlatList
      style={[styles.wrapper, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      data={matches || []}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      ListHeaderComponent={
        <View>
          <ThemeToggle />

          <RegexForm
            inputText={inputText}
            pattern={pattern}
            flags={flags}
            onInputChange={onInputChange}
            onPatternChange={onPatternChange}
            onFlagsChange={onFlagsChange}
            flagError={flagError}
          />

          {/* Botón de historial completo */}
          <View style={styles.section}>
            <Button title="Ver historial completo" onPress={onOpenHistory} color={theme.chipActive} />
          </View>

          <Text style={[styles.heading, { color: theme.text }]}>
            Texto con Coincidencias:
          </Text>

          <HighlightedText text={inputText} indices={indices ?? []} />

          <Text style={[styles.countText, { color: theme.secondaryText }]}>
            Total de coincidencias: {matches?.length ?? 0}
          </Text>

          {matches?.length > 0 && (
            <Text style={[styles.resultText, { color: theme.text }]}>
              Resultados:
            </Text>
          )}
        </View>
      }
      ListFooterComponent={ast ? <ASTTree ast={ast} textColor={theme.text} /> : null}
    />
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
