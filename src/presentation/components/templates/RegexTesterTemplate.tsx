// Importa React
import React from 'react';
// Importa componentes de UI desde React Native
import {
  FlatList,
  Text,
  Button,
  View,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
// Importa MobX observer para que el componente reaccione a cambios del estado global
import { observer } from 'mobx-react-lite';
// Importa el store que gestiona el modo claro/oscuro
import { themeStore } from '../../../store/themeStore';
// Importa los colores asociados a los temas
import { Colors } from '../../../theme/colors';

// Importa componentes UI del proyecto
import { RegexForm } from '../organisms/RegexForm';
import { ASTTree } from '../organisms/ASTTree';
import { MatchHighlight } from '../atoms/MatchHighlight';
import { HighlightedText } from '../atoms/HighlightedText';
import ThemeToggle from '../molecules/ThemeToggle';

// Define la interfaz de propiedades que recibe el componente
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
  onExportAST: (ast: any) => Promise<void>;
  onOpenDiagram: () => void; 
}

// Componente principal que actúa como plantilla visual para el analizador
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
  onExportAST,
  onOpenDiagram, 
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

          <View style={styles.section}>
            <Button
              title="Ver historial completo"
              onPress={onOpenHistory}
              color={theme.chipActive}
            />
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

          {ast && (
            <>
              <View style={styles.section}>
                <Button
                  title="Exportar AST"
                  onPress={() => onExportAST(ast)}
                  color={theme.accent}
                />
              </View>

              {/* Botón para abrir diagrama AST */}
              <View style={styles.section}>
                <Button
                  title="Ver Diagrama AST"
                  onPress={onOpenDiagram}
                  color={theme.primary}
                />
              </View>
            </>
          )}
        </View>
      }
      ListFooterComponent={ast ? <ASTTree ast={ast} textColor={theme.text} /> : null}
    />
  );
});

// Estilos del componente
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
