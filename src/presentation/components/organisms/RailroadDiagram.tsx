import React from 'react';
// Importa componentes de React Native
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
// Importa componente SVG raíz
import Svg from 'react-native-svg';
// Importa componentes personalizados del diagrama de ferrocarril
import RailroadNode from '../atoms/RailroadNode';
import RailroadBox from '../atoms/RailroadBox';
import RailroadConnection from '../atoms/RailroadConnection';
// Importa función que transforma el patrón RegEx en nodos visuales
import { parseRegexToRailroadNodes, RailroadVisualNode } from '../../../utils/regexToRailroadNodes';

interface Props {
  pattern: string; // Patrón de expresión regular a visualizar
}

// Constantes de configuración del diagrama
const BOX_HEIGHT = 0;           // Altura fija para las cajas (por ahora 0, el texto las define)
const BOX_PADDING = 20;         // Espacio entre cada caja
const TEXT_SIZE = 8;            // Tamaño base por carácter
const MIN_WIDTH = 70;           // Ancho mínimo para una caja
const START_OFFSET = 20;        // Desplazamiento inicial desde la izquierda
const LINE_SPACING = 80;        // Espacio entre líneas si hay varias secuencias
const MULTILINE_OFFSET = 60;    // Desplazamiento vertical adicional si hay varias líneas

// Componente principal que renderiza el diagrama de ferrocarril
export default function RailroadDiagram({ pattern }: Props) {
  const { width: windowWidth } = useWindowDimensions(); // Obtiene ancho de la pantalla
  const sequences = parseRegexToRailroadNodes(pattern); // Parsea la expresión regular a nodos visuales

  // Función para calcular el ancho de una caja basada en la longitud del texto
  const measureTextWidth = (text: string) =>
    Math.max(MIN_WIDTH, text.length * TEXT_SIZE);

  // Función recursiva para renderizar un nodo visual y sus hijos
  const renderNode = (
    node: RailroadVisualNode,
    x: number,
    y: number,
    keyPrefix: string
  ): any[] => {
    const elements: any[] = [];
    const verticalAlign = y - BOX_HEIGHT / 2;

    // Nodo de inicio (círculo verde)
    if (node.type === 'start') {
      elements.push(
        <RailroadNode key={`${keyPrefix}-start`} cx={x} cy={y} type="start" />
      );
    }

    // Nodo de fin (círculo rojo)
    if (node.type === 'end') {
      elements.push(
        <RailroadNode key={`${keyPrefix}-end`} cx={x} cy={y} type="end" />
      );
    }

    // Nodo de texto (una caja)
    if (node.type === 'text') {
      const width = measureTextWidth(node.label ?? '');
      elements.push(
        <RailroadBox
          key={`${keyPrefix}-text`}
          x={x}
          y={verticalAlign}
          width={width}
          height={BOX_HEIGHT}
          text={node.label ?? ''}
        />
      );
    }

    // Nodo agrupado o secuencia de nodos
    if (node.type === 'group' || node.type === 'sequence') {
      const children = node.children ?? [];
      let currentX = x;
      const childWidths = children.map((c) => measureTextWidth(c.label ?? ''));

      children.forEach((child, idx) => {
        const width = childWidths[idx];

        // Caso especial: primer nodo tipo 'start'
        if (idx === 0 && child.type === 'start') {
          elements.push(
            ...renderNode(child, currentX, y, `${keyPrefix}-child-${idx}`)
          );
          elements.push(
            <RailroadConnection
              key={`${keyPrefix}-start-conn`}
              x1={currentX + 5}
              y1={y}
              x2={currentX + 20}
              y2={y}
            />
          );
          currentX += 20;
        } else {
          // Conexión entre cajas
          if (idx > 0) {
            elements.push(
              <RailroadConnection
                key={`${keyPrefix}-conn-${idx}`}
                x1={currentX - BOX_PADDING}
                y1={y}
                x2={currentX}
                y2={y}
              />
            );
          }

          // Renderiza hijo
          elements.push(
            ...renderNode(child, currentX, y, `${keyPrefix}-child-${idx}`)
          );
          currentX += width + BOX_PADDING;
        }
      });

      // Renderiza etiqueta del grupo si la hay
      if (node.label) {
        elements.push(
          <RailroadBox
            key={`${keyPrefix}-label`}
            x={x}
            y={y - BOX_HEIGHT - 30}
            width={measureTextWidth(node.label)}
            height={30}
            text={node.label}
            bold
          />
        );
      }
    }

    return elements;
  };

  // Calcula el ancho total necesario para el SVG
  const totalWidth = sequences.reduce((sum, node) => {
    const children = node.children ?? [];
    const widths = children.map(
      (c) => measureTextWidth(c.label ?? '') + BOX_PADDING
    );
    return Math.max(sum, widths.reduce((a, b) => a + b, 200));
  }, windowWidth);

  // Altura total en función del número de secuencias
  const offset = sequences.length > 1 ? MULTILINE_OFFSET : 0;
  const totalHeight = Math.max(1, sequences.length) * LINE_SPACING + offset;

  return (
    <View style={{ backgroundColor: '#fff', padding: 10 }}>
      {/* Título */}
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 18,
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        Diagrama de Ferrocarril
      </Text>

      {/* Patrón mostrado como texto */}
      <Text
        style={{
          textAlign: 'center',
          fontSize: 14,
          marginBottom: 10,
        }}
      >
        {pattern}
      </Text>

      {/* Scroll horizontal para permitir ver el SVG completo */}
      <ScrollView horizontal>
        <Svg width={totalWidth + 100} height={totalHeight}>
          {sequences.map((seq, index) => (
            <React.Fragment key={`seq-${index}`}>
              {renderNode(seq, START_OFFSET, offset + 60 + index * LINE_SPACING, `seq-${index}`)}
            </React.Fragment>
          ))}
        </Svg>
      </ScrollView>
    </View>
  );
}
