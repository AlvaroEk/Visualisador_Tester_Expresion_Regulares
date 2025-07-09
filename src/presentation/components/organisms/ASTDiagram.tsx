import React from 'react';
// Importa el componente SVG principal
import Svg from 'react-native-svg';
// Importa elementos de interfaz de React Native
import { View, Text } from 'react-native';
// Importa MobX para observación reactiva
import { observer } from 'mobx-react-lite';
// Importa el store de tema para detectar modo oscuro/claro
import { themeStore } from '../../../store/themeStore';
// Importa componentes atómicos del diagrama AST
import ASTNode from '../atoms/ASTNode';
import ASTConnection from '../atoms/ASTConnection';
import ASTDefs from '../atoms/ASTDefs';
import ASTGrid from '../atoms/ASTGrid';
// Importa los tipos para nodos y conexiones
import { Node, Connection } from '../../../types/types';

interface Props {
  nodes: Node[];            // Lista de nodos que componen el AST
  connections: Connection[];// Lista de conexiones entre nodos
}

// Componente principal del diagrama AST
const ASTDiagram: React.FC<Props> = observer(({ nodes, connections }) => {
  const isDarkMode = themeStore.resolvedMode === 'dark'; // Detecta si el modo oscuro está activado

  const padding = 250;       // Espaciado adicional para evitar recortes
  const spacingX = 20;       // Espaciado horizontal aplicado a nodos y conexiones
  const spacingY = 30;       // Espaciado vertical aplicado a nodos y conexiones

  const MAX_SVG_DIMENSION = 5000;      // Dimensión máxima del canvas SVG
  const MAX_NODES_ALLOWED = 300;       // Límite de nodos a renderizar para evitar saturación

  // Si la lista de nodos es vacía o no es válida, muestra un mensaje
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? '#0f172a' : '#e3f2fd' }}>
        <Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 16 }}>
          No hay nodos para mostrar.
        </Text>
      </View>
    );
  }

  // Si hay demasiados nodos, se previene el renderizado y se muestra advertencia
  if (nodes.length > MAX_NODES_ALLOWED) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: isDarkMode ? '#0f172a' : '#e3f2fd' }}>
        <Text style={{ color: '#f00', fontSize: 16, textAlign: 'center' }}>
          El diagrama AST es demasiado grande para renderizar (más de {MAX_NODES_ALLOWED} nodos).
          {"\n"}Por favor, exporta el AST o usa una expresión más sencilla.
        </Text>
      </View>
    );
  }

  // Calcula dimensiones del SVG según la posición de los nodos
  const rawWidth = Math.max(...nodes.map((n) => n.x + spacingX)) + padding;
  const rawHeight = Math.max(...nodes.map((n) => n.y + spacingY)) + padding;
  const width = Math.min(rawWidth, MAX_SVG_DIMENSION);
  const height = Math.min(rawHeight, MAX_SVG_DIMENSION);

  // Configura colores dependiendo del modo de tema
  const backgroundColor = isDarkMode ? '#0f172a' : '#e3f2fd';
  const gridColor = isDarkMode ? '#1e293b' : '#bbdefb';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const strokeColor = isDarkMode ? '#90cdf4' : '#1e88e5';
  const pathColor = isDarkMode ? '#f1f5f9' : '#1e293b';

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <Svg width={width} height={height}>
        {/* Fondo cuadriculado */}
        <ASTGrid width={width} height={height} backgroundColor={backgroundColor} gridColor={gridColor} />
        {/* Definiciones de gradientes y flechas */}
        <ASTDefs pathColor={pathColor} />

        {/* Dibuja las conexiones entre nodos */}
        {connections.map((conn, index) => {
          const from = nodes.find((n) => n.id === conn.from); // Nodo origen
          const to = nodes.find((n) => n.id === conn.to);     // Nodo destino
          if (!from || !to) {
            console.warn(`Conexión inválida ignorada: ${conn.from} -> ${conn.to}`);
            return null;
          }

          return (
            <ASTConnection
              key={index}
              connection={conn}
              from={from}
              to={to}
              spacingX={spacingX}
              spacingY={spacingY}
              pathColor={pathColor}
              textColor={textColor}
            />
          );
        })}

        {/* Dibuja los nodos */}
        {nodes.map((node) => {
          if (!node || typeof node.x !== 'number' || typeof node.y !== 'number') return null;

          // Calcula radio y tamaño de fuente según longitud del texto
          const textLength = node.label.length;
          const baseRadius = 36;
          const maxRadius = 55;
          const radius = Math.min(maxRadius, Math.max(baseRadius, textLength * 4.2));
          const fontSize = Math.max(10, Math.min(16, radius / 3));
          const cx = node.x + spacingX;
          const cy = node.y + spacingY;
          const gradientId = isDarkMode ? 'nodeGradientDark' : 'nodeGradientLight';

          return (
            <ASTNode
              key={node.id}
              id={node.id}
              label={node.label}
              cx={cx}
              cy={cy}
              radius={radius}
              fontSize={fontSize}
              fill={`url(#${gradientId})`}
              stroke={strokeColor}
              textColor={textColor}
            />
          );
        })}
      </Svg>
    </View>
  );
});

export default ASTDiagram; // Exporta el componente principal del diagrama AST
