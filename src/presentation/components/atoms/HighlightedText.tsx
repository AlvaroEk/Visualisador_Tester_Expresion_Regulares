// Importa React para usar JSX y componentes funcionales
import React from 'react';
// Importa el componente Text de React Native para renderizar texto en pantalla
import { Text } from 'react-native';
// Importa el store del tema para determinar si está en modo oscuro o claro
import { themeStore } from '../../../store/themeStore';

// Define la interfaz de propiedades que espera el componente
interface Props {
  // Texto completo que se desea mostrar con resaltado
  text: string;

  // Lista de tuplas que indican los rangos [inicio, fin] de los textos a resaltar
  indices: [number, number][];

  // Color opcional para el texto base (no resaltado)
  textColor?: string;
}

// Componente funcional que muestra un texto con partes resaltadas según los índices dados
export const HighlightedText: React.FC<Props> = ({ text, indices, textColor }) => {
  // Determina si el tema actual es oscuro
  const isDark = themeStore.resolvedMode === 'dark';

  // Define el color base del texto según el tema o el valor proporcionado por props
  const baseTextColor = textColor ?? (isDark ? '#fff' : '#000');

  // Define el color de fondo del resaltado
  const highlightBg = '#feeb9b'; // Amarillo claro

  // Define el color del texto resaltado (negro para mejor contraste)
  const highlightTextColor = '#000';

  // Si no hay índices, retorna el texto completo sin resaltar
  if (!indices || indices.length === 0) {
    return <Text style={{ color: baseTextColor }}>{text}</Text>;
  }

  // Arreglo que contendrá las partes del texto separadas y/o resaltadas
  const parts: React.ReactNode[] = [];

  // Índice de donde empieza la próxima sección no resaltada
  let lastIndex = 0;

  // Itera por cada rango de índices para dividir el texto en partes
  indices.forEach(([start, end], i) => {
    // Si hay texto entre el último índice y el nuevo inicio, se agrega como texto normal
    if (lastIndex < start) {
      parts.push(
        <Text key={`normal-${i}`} style={{ color: baseTextColor }}>
          {text.slice(lastIndex, start)}
        </Text>
      );
    }

    // Agrega la parte del texto resaltada según el rango actual
    parts.push(
      <Text
        key={`highlight-${i}`}
        style={{
          backgroundColor: highlightBg,
          color: highlightTextColor,
          fontWeight: 'bold',
        }}
      >
        {text.slice(start, end)}
      </Text>
    );

    // Actualiza el índice de la última posición procesada
    lastIndex = end;
  });

  // Si aún queda texto sin procesar al final, se agrega como texto normal
  if (lastIndex < text.length) {
    parts.push(
      <Text key="last" style={{ color: baseTextColor }}>
        {text.slice(lastIndex)}
      </Text>
    );
  }

  // Devuelve todos los fragmentos combinados dentro de un solo componente Text
  return <Text>{parts}</Text>;
};
