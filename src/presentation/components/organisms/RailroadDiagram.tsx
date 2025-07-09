import React from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import Svg from 'react-native-svg';
import RailroadNode from '../atoms/RailroadNode';
import RailroadBox from '../atoms/RailroadBox';
import RailroadConnection from '../atoms/RailroadConnection';
import { parseRegexToRailroadNodes, RailroadVisualNode } from '../../../utils/regexToRailroadNodes';

interface Props {
  pattern: string;
}

const BOX_HEIGHT = 0;
const BOX_PADDING = 20;
const TEXT_SIZE = 8;
const MIN_WIDTH = 70;
const START_OFFSET = 20;

export default function RailroadDiagram({ pattern }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const sequences = parseRegexToRailroadNodes(pattern);

  const measureTextWidth = (text: string) =>
    Math.max(MIN_WIDTH, text.length * TEXT_SIZE);

  const renderNode = (
    node: RailroadVisualNode,
    x: number,
    y: number,
    keyPrefix: string
  ): any[] => {
    const elements: any[] = [];
    const verticalAlign = y - BOX_HEIGHT / 2;

    if (node.type === 'start') {
      // Solo el nodo, sin conexión
      elements.push(
        <RailroadNode key={`${keyPrefix}-start`} cx={x} cy={y} type="start" />
      );
    }

    if (node.type === 'end') {
      elements.push(
        <RailroadNode key={`${keyPrefix}-end`} cx={x} cy={y} type="end" />
      );
    }

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

    if (node.type === 'group' || node.type === 'sequence') {
      const children = node.children ?? [];
      let currentX = x;
      const childWidths = children.map((c) => measureTextWidth(c.label ?? ''));

      children.forEach((child, idx) => {
        const width = childWidths[idx];

        // Si el primero es un nodo de inicio, se conecta directamente a lo que sigue
        if (idx === 0 && child.type === 'start') {
          // Render el nodo de inicio
          elements.push(
            ...renderNode(child, currentX, y, `${keyPrefix}-child-${idx}`)
          );
          // Línea que conecta el nodo de inicio al siguiente
          elements.push(
            <RailroadConnection
              key={`${keyPrefix}-start-conn`}
              x1={currentX + 5}
              y1={y}
              x2={currentX + 20}
              y2={y}
            />
          );
          currentX += 20; // Desplazamiento después del nodo
        } else {
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

          elements.push(
            ...renderNode(child, currentX, y, `${keyPrefix}-child-${idx}`)
          );
          currentX += width + BOX_PADDING;
        }
      });

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

  const totalWidth = sequences.reduce((sum, node) => {
    const children = node.children ?? [];
    const widths = children.map(
      (c) => measureTextWidth(c.label ?? '') + BOX_PADDING
    );
    return Math.max(sum, widths.reduce((a, b) => a + b, 200));
  }, windowWidth);

  return (
    <View style={{ backgroundColor: '#fff', padding: 10 }}>
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

      <Text
        style={{
          textAlign: 'center',
          fontSize: 14,
          marginBottom: 10,
        }}
      >
        {pattern}
      </Text>

      <ScrollView horizontal>
        <Svg width={totalWidth + 100} height={120}>
          {sequences.map((seq, index) => (
            <React.Fragment key={`seq-${index}`}>
              {renderNode(seq, START_OFFSET, 60, `seq-${index}`)}
            </React.Fragment>
          ))}
        </Svg>
      </ScrollView>
    </View>
  );
}
