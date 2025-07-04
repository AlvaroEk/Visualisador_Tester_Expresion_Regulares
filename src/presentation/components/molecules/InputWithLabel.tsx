// Importa React para usar componentes funcionales y JSX
import React from 'react';
// Importa componentes y utilidades de estilo desde React Native
import { View, TextInput, Text, StyleSheet } from 'react-native';

// Define la interfaz de propiedades que recibe el componente
interface Props {
  // Texto de la etiqueta que acompaña al campo
  label: string;

  // Valor actual del input
  value: string;

  // Función que se ejecuta al cambiar el texto
  onChange: (text: string) => void;

  // Texto de marcador de posición (opcional)
  placeholder?: string;

  // Indica si el componente debe mostrarse en modo oscuro (opcional)
  dark?: boolean;
}

// Componente funcional que muestra un input con una etiqueta encima
export const InputWithLabel = ({
  label,
  value,
  onChange,
  placeholder,
  dark = false, // Por defecto no es oscuro
}: Props) => {
  return (
    // Contenedor con margen inferior para separar visualmente
    <View style={{ marginBottom: 12 }}>
      {/* Muestra la etiqueta, ajustando el color si está en modo oscuro */}
      <Text style={[styles.label, dark && styles.labelDark]}>{label}</Text>

      {/* Campo de entrada de texto con estilos según el modo (oscuro o claro) */}
      <TextInput
        style={[styles.input, dark && styles.inputDark]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        // Cambia el color del placeholder según el modo
        placeholderTextColor={dark ? '#aaa' : '#888'}
      />
    </View>
  );
};

// Estilos utilizados por el componente
const styles = StyleSheet.create({
  // Estilo de la etiqueta (modo claro por defecto)
  label: {
    marginBottom: 4,
    color: '#333',
    fontWeight: 'bold',
  },
  // Estilo alternativo para la etiqueta en modo oscuro
  labelDark: {
    color: '#eee',
  },
  // Estilo base del campo de entrada
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  // Estilo alternativo para el input en modo oscuro
  inputDark: {
    backgroundColor: '#222',
    color: '#fff',
    borderColor: '#555',
  },
});
