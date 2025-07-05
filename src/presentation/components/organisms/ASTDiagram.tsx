import React from 'react';
import Svg, {
  Circle,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Marker,
  Path,
  G,
  Rect,
} from 'react-native-svg';
import { View } from 'react-native';

type Node = { id: string; label: string; x: number; y: number };
type Connection = { from: string; to: string; label?: string };

interface Props {
  nodes: Node[];
  connections: Connection[];
}

const ASTDiagram: React.FC<Props> = ({ nodes, connections }) => {
  const padding = 120; 
  const spacingX = 20;
  const spacingY = 15; 

  const width = Math.max(...nodes.map((n) => n.x + spacingX)) + padding;
  const height = Math.max(...nodes.map((n) => n.y + spacingY)) + padding;

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4f8' }}>
      <Svg width={width} height={height}>
        {/* Cuadriculado de fondo */}
        <Rect width={width} height={height} fill="#f0f4f8" />
        {[...Array(Math.ceil(height / 40)).keys()].map((y) =>
          [...Array(Math.ceil(width / 40)).keys()].map((x) => (
            <Rect
              key={`${x}-${y}`}
              x={x * 40}
              y={y * 40}
              width={40}
              height={40}
              fill="none"
              stroke="#d9e2ec"
              strokeWidth={0.4}
            />
          ))
        )}

        {/* Gradiente y flecha */}
        <Defs>
          <LinearGradient id="nodeGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#A1C4FD" />
            <Stop offset="100%" stopColor="#C2E9FB" />
          </LinearGradient>
          <Marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <Path d="M0,0 L0,6 L6,3 Z" fill="#555" />
          </Marker>
        </Defs>

        {/* Conexiones curvas */}
        {connections.map((conn, index) => {
          const from = nodes.find((n) => n.id === conn.from);
          const to = nodes.find((n) => n.id === conn.to);
          if (!from || !to) return null;

          const fromX = from.x + spacingX;
          const fromY = from.y + spacingY;
          const toX = to.x + spacingX;
          const toY = to.y + spacingY;
          const midX = (fromX + toX) / 2;

          return (
            <G key={index}>
              <Path
                d={`M${fromX},${fromY} Q${midX},${fromY} ${toX},${toY}`}
                stroke="#555"
                strokeWidth={1.5}
                fill="none"
                markerEnd="url(#arrow)"
              />
              {conn.label && (
                <SvgText
                  x={midX}
                  y={(fromY + toY) / 2 - 10}
                  fontSize="10"
                  fill="#444"
                  textAnchor="middle"
                >
                  {conn.label}
                </SvgText>
              )}
            </G>
          );
        })}

        {/* Nodos */}
        {nodes.map((node) => {
          const textLength = node.label.length;
          const baseRadius = 36;
          const maxRadius = 55;
          const radius = Math.min(maxRadius, Math.max(baseRadius, textLength * 4.2));
          const fontSize = Math.max(10, Math.min(16, radius / 3));

          return (
            <G key={node.id}>
              <Circle
                cx={node.x + spacingX}
                cy={node.y + spacingY}
                r={radius}
                fill="url(#nodeGradient)"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <SvgText
                x={node.x + spacingX}
                y={node.y + spacingY + fontSize * 0.35}
                fontSize={fontSize}
                fontWeight="bold"
                fill="#1E293B"
                textAnchor="middle"
              >
                {node.label}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

export default ASTDiagram;
