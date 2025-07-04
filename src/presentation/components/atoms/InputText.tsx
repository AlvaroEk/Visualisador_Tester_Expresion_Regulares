// Importa React para usar componentes y JSX
import React from 'react';
// Importa el componente TextInput y utilidades de estilo desde React Native
import { TextInput, StyleSheet } from 'react-native';

// Define la interfaz de propiedades que recibe el componente
interface Props {
  // Valor actual del campo de texto
  value: string;

  // Función que se ejecuta cuando el texto cambia
  onChange: (text: string) => void;

  // Texto opcional que se muestra como marcador de posición
  placeholder?: string;
}

// Componente funcional que representa un campo de entrada de texto controlado
export const InputText = ({ value, onChange, placeholder }: Props) => (
  <TextInput
    // Aplica los estilos definidos abajo
    style={styles.input}

    // Asigna el valor actual del input
    value={value}

    // Llama a la función onChange cuando cambia el texto
    onChangeText={onChange}

    // Muestra el texto de marcador de posición, si existe
    placeholder={placeholder}

    // No capitaliza automáticamente las palabras
    autoCapitalize="none"

    // Desactiva la autocorrección del sistema
    autoCorrect={false}
  />
);

// Define los estilos para el componente TextInput
const styles = StyleSheet.create({
  input: {
    // Borde con grosor 1
    borderWidth: 1,

    // Espaciado interno del input
    padding: 10,

    // Bordes redondeados
    borderRadius: 8,

    // Margen vertical entre otros componentes
    marginVertical: 4,
  },
});
