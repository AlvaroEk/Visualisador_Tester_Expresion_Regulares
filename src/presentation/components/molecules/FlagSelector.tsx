// Importa React para usar JSX y componentes
import React from 'react';
// Importa componentes de UI desde React Native
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
// Importa herramientas de animación de Reanimated
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

// Define las propiedades que espera el componente
interface Props {
  // Banderas seleccionadas (como string, por ejemplo "gi")
  selectedFlags: string;

  // Función que se ejecuta cuando se actualizan las banderas
  onChange: (flags: string) => void;

  // Lista de banderas inválidas para marcar visualmente (opcional)
  invalidFlags?: string[];

  // Indica si se debe usar modo oscuro (opcional)
  dark?: boolean;
}

// Lista de todas las banderas válidas de expresiones regulares en JavaScript
const FLAGS = ['g', 'i', 'm', 's', 'u', 'y'];

// Componente funcional que permite seleccionar/desmarcar banderas de una expresión regular
export const FlagSelector = ({ selectedFlags, onChange, invalidFlags = [], dark = false }: Props) => {
  // Función que alterna el estado de una bandera (la agrega o la quita del string)
  const toggleFlag = (flag: string) => {
    const index = selectedFlags.indexOf(flag);
    const updated =
      index === -1
        ? selectedFlags + flag // Si no está, se agrega
        : selectedFlags.slice(0, index) + selectedFlags.slice(index + 1); // Si está, se elimina
    onChange(updated); // Se notifica el cambio
  };

  return (
    <View style={styles.container}>
      {/* Itera sobre todas las banderas disponibles */}
      {FLAGS.map((flag) => {
        // Determina si la bandera está seleccionada
        const selected = selectedFlags.includes(flag);

        // Determina si la bandera es inválida
        const invalid = invalidFlags.includes(flag);

        // Valor animado que representa la escala del botón
        const scale = useSharedValue(1);

        // Estilo animado que reacciona a los cambios en `scale`
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: withTiming(scale.value, { duration: 200 }) }],
        }));

        // Acción al presionar el botón
        const onPress = () => {
          scale.value = 1.2; // Agranda el botón brevemente
          toggleFlag(flag);  // Alterna el estado de la bandera
          setTimeout(() => (scale.value = 1), 200); // Restaura la escala
        };

        // Define el color de fondo según estado y modo oscuro
        const backgroundColor = selected
          ? dark
            ? '#2196f3' // Azul claro en modo oscuro
            : '#007bff' // Azul en modo claro
          : dark
          ? '#444' // Gris oscuro no seleccionado
          : '#eee'; // Gris claro no seleccionado

        // Define el color del texto según estado y modo oscuro
        const color = selected
          ? '#fff'     // Texto blanco si está seleccionado
          : dark
          ? '#ccc'     // Texto gris claro en modo oscuro
          : '#000';    // Texto negro en modo claro

        // Renderiza el botón individual para cada bandera
        return (
          <TouchableWithoutFeedback key={flag} onPress={onPress}>
            <Animated.View
              style={[
                styles.flag,
                { backgroundColor, borderColor: invalid ? 'red' : 'transparent' },
                animatedStyle,
              ]}
            >
              <Text style={[styles.flagText, { color }]}>{flag}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

// Estilos utilizados por el componente
const styles = StyleSheet.create({
  // Estilo del contenedor principal (fila con espacios)
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // Espaciado entre botones
  },
  // Estilo de cada botón de bandera
  flag: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, // Borde visible si es inválido
  },
  // Estilo del texto de la bandera
  flagText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
