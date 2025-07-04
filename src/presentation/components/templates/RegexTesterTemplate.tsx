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
  inputText: string;                         // Texto de entrada para analizar
  pattern: string;                           // Patrón de expresión regular
  flags: string;                             // Banderas seleccionadas
  matches: string[];                         // Lista de coincidencias encontradas
  indices: [number, number][];               // Índices de coincidencias en el texto
  ast: any;                                  // Árbol de sintaxis generado (AST)
  flagError?: string;                        // Error si las flags son inválidas
  onInputChange: (text: string) => void;     // Función para manejar cambios de texto
  onPatternChange: (text: string) => void;   // Función para manejar cambios de patrón
  onFlagsChange: (text: string) => void;     // Función para manejar cambios de flags
  onOpenHistory: () => void;                 // Función para abrir historial
  onExportAST: (ast: any) => Promise<void>;  // Función para exportar AST
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
}: Props) => {
  // Detecta si está activado el modo oscuro
  const isDark = themeStore.resolvedMode === 'dark';
  // Obtiene los colores adecuados según el modo
  const theme = isDark ? Colors.dark : Colors.light;

  // Renderiza un ítem de coincidencia usando MatchHighlight
  const renderItem: ListRenderItem<string> = ({ item, index }) => (
    <MatchHighlight key={index} match={item} />
  );

  return (
    <FlatList
      style={[styles.wrapper, { backgroundColor: theme.background }]} // Fondo dinámico según el tema
      contentContainerStyle={styles.content} // Espaciado general
      data={matches || []} // Lista de coincidencias
      keyExtractor={(_, index) => index.toString()} // Clave única para cada ítem
      renderItem={renderItem} // Renderiza cada coincidencia
      ListHeaderComponent={
        <View>
          {/* Toggle para cambiar el tema */}
          <ThemeToggle />

          {/* Formulario de entrada */}
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
            <Button title="Ver historial completo" onPress={onOpenHistory} color={theme.chipActive} />
          </View>

          {/* Texto que indica sección de coincidencias */}
          <Text style={[styles.heading, { color: theme.text }]}>
            Texto con Coincidencias:
          </Text>

          {/* Texto con coincidencias resaltadas */}
          <HighlightedText text={inputText} indices={indices ?? []} />

          {/* Cantidad de coincidencias encontradas */}
          <Text style={[styles.countText, { color: theme.secondaryText }]}>
            Total de coincidencias: {matches?.length ?? 0}
          </Text>

          {/* Si hay coincidencias, muestra el título de resultados */}
          {matches?.length > 0 && (
            <Text style={[styles.resultText, { color: theme.text }]}>
              Resultados:
            </Text>
          )}

          {/* Si hay un AST generado, muestra botón para exportarlo */}
          {ast && (
            <View style={styles.section}>
              <Button
                title="Exportar AST"
                onPress={() => onExportAST(ast)}
                color={theme.accent}
              />
            </View>
          )}
        </View>
      }
      // Muestra el árbol de sintaxis al final de la lista, si existe
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
