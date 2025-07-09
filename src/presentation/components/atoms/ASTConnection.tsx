import React from 'react';
// Importa elementos SVG: G (grupo), Path (línea curva), y Text como SvgText para compatibilidad con React Native SVG
import { G, Path, Text as SvgText } from 'react-native-svg';
// Importa los tipos personalizados para conexiones y nodos del AST
import { Connection, Node } from '../../../types/types';

// Define las props que acepta este componente de conexión visual
interface ASTConnectionProps {
  connection: Connection; // Objeto que representa la conexión (incluye ID o etiqueta)
  from: Node;             // Nodo de origen (con coordenadas x/y)
  to: Node;               // Nodo de destino
  spacingX: number;       // Espaciado horizontal aplicado a las posiciones
  spacingY: number;       // Espaciado vertical aplicado a las posiciones
  pathColor: string;      // Color de la línea de conexión
  textColor: string;      // Color del texto de la etiqueta (si existe)
}

// Componente funcional para dibujar una conexión curva entre dos nodos
const ASTConnection: React.FC<ASTConnectionProps> = ({
  connection,
  from,
  to,
  spacingX,
  spacingY,
  pathColor,
  textColor,
}) => {
  // Validación para evitar errores con nodos incompletos o sin coordenadas
  if (
    !from || !to ||
    typeof from.x !== 'number' || typeof from.y !== 'number' ||
    typeof to.x !== 'number' || typeof to.y !== 'number'
  ) {
    // Muestra una advertencia en consola si la conexión no es válida
    console.warn(`Conexión inválida ignorada: ${connection?.from} -> ${connection?.to}`);
    return null; // No renderiza nada si hay datos inválidos
  }

  // Calcula las posiciones reales con espaciado incluido
  const fromX = from.x + spacingX;
  const fromY = from.y + spacingY;
  const toX = to.x + spacingX;
  const toY = to.y + spacingY;

  // Punto medio entre origen y destino, usado para curvar la línea y ubicar etiquetas
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  return (
    <G>
      {/* Dibuja una línea curva tipo "cuadrática" entre los dos nodos */}
      <Path
        d={`M${fromX},${fromY} Q${midX},${fromY} ${toX},${toY}`} // Curva de Bezier
        stroke={pathColor}    // Color del trazo
        strokeWidth={1.5}     // Grosor de la línea
        fill="none"           // Sin relleno
        markerEnd="url(#arrow)" // Usa una flecha al final si está definida en SVG defs
      />

      {/* Si la conexión tiene una etiqueta, la muestra encima de la línea */}
      {connection.label && (
        <SvgText
          x={midX}              // Posición horizontal del texto
          y={midY - 10}         // Posición vertical ajustada por encima
          fontSize={10}         // Tamaño de fuente
          fill={textColor}      // Color del texto
          textAnchor="middle"   // Centrado horizontal
        >
          {/* Si la etiqueta es muy larga, la recorta y agrega "..." */}
          {connection.label.length > 30
            ? connection.label.slice(0, 27) + '...'
            : connection.label}
        </SvgText>
      )}
    </G>
  );
};

// Exporta el componente para su uso en el diagrama AST
export default ASTConnection;
