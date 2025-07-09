import React from 'react';
// Importa componentes básicos de UI y listas desde React Native
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
// Importa MobX observer para que el componente reaccione a cambios observables
import { observer } from 'mobx-react-lite';
// Importa el store de tema para aplicar tema claro/oscuro
import { themeStore } from '../../../store/themeStore';
// Paleta de colores global del tema
import { Colors } from '../../../theme/colors';

// Importa componentes del módulo visual
import { RegexForm } from '../organisms/RegexForm';         // Formulario de entrada para regex
import { ASTTree } from '../organisms/ASTTree';             // Árbol de sintaxis abstracta (AST)
import { MatchHighlight } from '../atoms/MatchHighlight';   // Componente para mostrar coincidencias individuales
import { HighlightedText } from '../atoms/HighlightedText'; // Componente que subraya coincidencias en el texto
import ThemeToggle from '../molecules/ThemeToggle';         // Botón para cambiar de tema claro/oscuro

// Interfaz que define las propiedades que recibe esta plantilla
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
  onOpenRailroad: () => void;
}

// Componente principal que renderiza la pantalla del Regex Tester
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
  onOpenRailroad,
}: Props) => {
  const isDark = themeStore.resolvedMode === 'dark';              // Detecta si está en modo oscuro
  const theme = isDark ? Colors.dark : Colors.light;              // Asigna la paleta de colores según el modo

  // Función para renderizar coincidencias (no usada directamente con FlatList aquí)
  const renderItem: ListRenderItem<string> = ({ item, index }) => (
    <MatchHighlight key={index} match={item} />
  );

  return (
    <FlatList
      style={[styles.wrapper, { backgroundColor: theme.background }]} // Aplica fondo dinámico
      contentContainerStyle={styles.content}
      data={[]}                 // FlatList no muestra ítems; todo está en ListHeaderComponent
      keyExtractor={(_, index) => index.toString()}
      renderItem={null}
      ListHeaderComponent={
        <View>
          <ThemeToggle />

          {/* Formulario para ingresar texto, patrón y flags */}
          <RegexForm
            inputText={inputText}
            pattern={pattern}
            flags={flags}
            onInputChange={onInputChange}
            onPatternChange={onPatternChange}
            onFlagsChange={onFlagsChange}
            flagError={flagError}
          />

          {/* Botón para abrir el historial */}
          <View style={styles.section}>
            <StyledButton
              title="VER HISTORIAL COMPLETO"
              color={theme.chipActive}
              onPress={onOpenHistory}
              textColor="#fff"
            />
          </View>

          {/* Título para la sección de coincidencias */}
          <Text style={[styles.heading, { color: theme.text }]}>
            Texto con Coincidencias:
          </Text>

          {/* Texto principal con coincidencias resaltadas */}
          <HighlightedText text={inputText} indices={indices ?? []} />

          {/* Cantidad total de coincidencias encontradas */}
          <Text style={[styles.countText, { color: theme.secondaryText }]}>
            Total de coincidencias: {matches?.length ?? 0}
          </Text>

          {/* Si hay coincidencias, renderiza los resultados individuales */}
          {matches?.length > 0 && (
            <>
              <Text style={[styles.resultText, { color: theme.text }]}>
                Resultados:
              </Text>

              {matches.map((match, index) => (
                <MatchHighlight key={index} match={match} />
              ))}
            </>
          )}

          {/* Si hay un AST válido, muestra opciones para exportar o visualizar */}
          {ast && (
            <>
              <View style={styles.section}>
                <StyledButton
                  title="EXPORTAR AST"
                  color={theme.accent}
                  onPress={() => onExportAST(ast)}
                  textColor="#fff"
                />
              </View>

              <View style={styles.section}>
                <StyledButton
                  title="VER DIAGRAMA AST"
                  color={theme.primary}
                  onPress={onOpenDiagram}
                  textColor="#fff"
                />
              </View>

              <View style={styles.section}>
                <StyledButton
                  title="VER DIAGRAMA DE FERROCARRIL"
                  color={theme.warning}
                  onPress={onOpenRailroad}
                  textColor="#000"
                />
              </View>
            </>
          )}
        </View>
      }
      ListFooterComponent={
        ast ? <ASTTree ast={ast} textColor={theme.text} /> : null // Muestra el árbol AST al final
      }
    />
  );
});

// Componente reutilizable de botón con estilos personalizados
const StyledButton = ({
  title,
  color,
  onPress,
  textColor = '#fff',
}: {
  title: string;
  color: string;
  onPress: () => void;
  textColor?: string;
}) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: color }]}>
    <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
  </TouchableOpacity>
);

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
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
