import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { InputWithLabel } from '../components/molecules/InputWithLabel';
import { FlagSelector } from '../components/molecules/FlagSelector';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../../store/themeStore';

interface Props {
  inputText: string;
  pattern: string;
  flags: string;
  onInputChange: (text: string) => void;
  onPatternChange: (text: string) => void;
  onFlagsChange: (text: string) => void;
  flagError?: string;
}

export const RegexForm = observer(({
  inputText,
  pattern,
  flags,
  onInputChange,
  onPatternChange,
  onFlagsChange,
  flagError,
}: Props) => {
  const [showFlagInfo, setShowFlagInfo] = useState(false);
  const isDark = themeStore.resolvedMode === 'dark';

  const extractInvalidFlags = (flags: string): string[] => {
    const valid = 'gimsuy';
    return flags.split('').filter(f => !valid.includes(f));
  };

  return (
    <View>
      <InputWithLabel
        label="Texto de entrada"
        value={inputText}
        onChange={onInputChange}
        dark={isDark}
      />

      <InputWithLabel
        label="Expresión regular"
        value={pattern}
        onChange={onPatternChange}
        dark={isDark}
      />

      <Text style={[styles.label, isDark && styles.labelDark]}>
        🏷️ Selecciona los flags de la expresión regular:
      </Text>

      <FlagSelector
        selectedFlags={flags}
        onChange={onFlagsChange}
        invalidFlags={flagError ? extractInvalidFlags(flags) : []}
        dark={isDark}
      />

      <TouchableOpacity onPress={() => setShowFlagInfo(!showFlagInfo)}>
        <Text style={[styles.help, isDark && styles.helpDark]}>
          {showFlagInfo ? 'Ocultar ayuda de flags' : '¿Qué significan los flags?'}
        </Text>
      </TouchableOpacity>

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

      {flagError ? (
        <Text style={{ color: 'red', marginTop: 4 }}>
          Flags inválidos: {extractInvalidFlags(flags).join(', ')}
        </Text>
      ) : null}
    </View>
  );
});

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
