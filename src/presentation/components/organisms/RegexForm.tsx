// Importa React y el hook useState
import React, { useState } from 'react';
// Importa componentes visuales y de interacción desde React Native
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// Importa el input personalizado con etiqueta
import { InputWithLabel } from '../../components/molecules/InputWithLabel';
// Importa el componente selector de flags de expresiones regulares
import { FlagSelector } from '../../components/molecules/FlagSelector';
// Importa observer de MobX para que el componente sea reactivo al estado
import { observer } from 'mobx-react-lite';
// Importa el store del tema para saber si el modo es oscuro o claro
import { themeStore } from '../../../store/themeStore';

// Define las props que acepta el componente RegexForm
interface Props {
  inputText: string;                    // Texto sobre el cual aplicar la expresión
  pattern: string;                      // Patrón de la expresión regular
  flags: string;                        // Flags seleccionados
  onInputChange: (text: string) => void;    // Manejador del texto de entrada
  onPatternChange: (text: string) => void;  // Manejador del patrón de expresión
  onFlagsChange: (text: string) => void;    // Manejador de flags
  flagError?: string;                  // Texto de error si hay flags inválidos
}

// Componente funcional RegexForm observado por MobX
export const RegexForm = observer(({
  inputText,
  pattern,
  flags,
  onInputChange,
  onPatternChange,
  onFlagsChange,
  flagError,
}: Props) => {
  // Estado local para mostrar/ocultar ayuda de flags
  const [showFlagInfo, setShowFlagInfo] = useState(false);

  // Detecta si el tema actual es oscuro
  const isDark = themeStore.resolvedMode === 'dark';

  // Función que detecta flags inválidos comparándolos con los válidos
  const extractInvalidFlags = (flags: string): string[] => {
    const valid = 'gimsuy';
    return flags.split('').filter(f => !valid.includes(f));
  };

  return (
    <View>
      {/* Campo de texto de entrada */}
      <InputWithLabel
        label="Texto de entrada"
        value={inputText}
        onChange={onInputChange}
        dark={isDark}
      />

      {/* Campo del patrón de expresión regular */}
      <InputWithLabel
        label="Expresión regular"
        value={pattern}
        onChange={onPatternChange}
        dark={isDark}
      />

      {/* Etiqueta para los flags */}
      <Text style={[styles.label, isDark && styles.labelDark]}>
        Selecciona los flags de la expresión regular:
      </Text>

      {/* Componente que permite seleccionar los flags */}
      <FlagSelector
        selectedFlags={flags}
        onChange={onFlagsChange}
        invalidFlags={flagError ? extractInvalidFlags(flags) : []}
        dark={isDark}
      />

      {/* Botón para mostrar/ocultar la ayuda de flags */}
      <TouchableOpacity onPress={() => setShowFlagInfo(!showFlagInfo)}>
        <Text style={[styles.help, isDark && styles.helpDark]}>
          {showFlagInfo ? 'Ocultar ayuda de flags' : '¿Qué significan los flags?'}
        </Text>
      </TouchableOpacity>

      {/* Ayuda expandible explicando el significado de cada flag */}
      {showFlagInfo && (
        <View style={[styles.helpBox, isDark && styles.helpBoxDark]}>
          <Text style={isDark && styles.textDark}><Text style={styles.bold}>g</Text> = Global (todas las coincidencias)</Text>
          <Text style={isDark && styles.textDark}><Text style={styles.bold}>i</Text> = Ignorar mayúsculas/minúsculas</Text>
          <Text style={isDark && styles.textDark}><Text style={styles.bold}>m</Text> = Multilínea (^ y $ en cada línea)</Text>
          <Text style={isDark && styles.textDark}><Text style={styles.bold}>s</Text> = DotAll (el punto captura saltos de línea)</Text>
          <Text style={isDark && styles.textDark}><Text style={styles.bold}>u</Text> = Unicode (emojis, símbolos, etc.)</Text>
          <Text style={isDark && styles.textDark}><Text style={styles.bold}>y</Text> = Sticky (desde posición exacta)</Text>
        </View>
      )}

      {/* Mensaje de error si hay flags inválidos */}
      {flagError ? (
        <Text style={{ color: 'red', marginTop: 4 }}>
          Flags inválidos: {extractInvalidFlags(flags).join(', ')}
        </Text>
      ) : null}
    </View>
  );
});

// Estilos utilizados en el componente
const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#222',
  },
  labelDark: {
    color: '#eee',
  },
  help: {
    color: '#007bff',
    marginTop: 6,
    marginBottom: 2,
  },
  helpDark: {
    color: '#80bfff',
  },
  helpBox: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
  },
  helpBoxDark: {
    backgroundColor: '#333',
  },
  textDark: {
    color: '#ccc',
  },
  bold: {
    fontWeight: 'bold',
  },
});
