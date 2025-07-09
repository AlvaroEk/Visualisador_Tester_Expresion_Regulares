import React from 'react';
// Importa los componentes SVG necesarios: G para agrupar, Rect para dibujar cajas, y Text como SvgText para etiquetas
import { G, Rect, Text as SvgText } from 'react-native-svg';

// Define las propiedades esperadas por el componente
interface Props {
  x: number;          // Posición horizontal del cuadro
  y: number;          // Posición vertical del cuadro
  width: number;      // Ancho del rectángulo
  height: number;     // Alto del rectángulo
  text: string;       // Texto a mostrar dentro de la caja
  bold?: boolean;     // Indica si el texto debe ser negrita (opcional)
}

// Componente que representa una caja de texto para diagramas de ferrocarril
const RailroadBox: React.FC<Props> = ({ x, y, width, height, text, bold = false }) => {
  return (
    <G>
      {/* Caja con esquinas redondeadas, relleno azul claro y borde azul */}
      <Rect
        x={x}
        y={y}
        rx={8}
        ry={8}
        width={width}
        height={height}
        fill="#e6f0ff"
        stroke="#3366cc"
        strokeWidth={1.5}
      />
      {/* Texto centrado dentro de la caja */}
      <SvgText
        x={x + width / 2}
        y={y + height / 2 + 4} // Se ajusta +4 para centrar verticalmente
        fontSize="14"
        fontWeight={bold ? 'bold' : 'normal'}
        fill="#000"
        textAnchor="middle"
      >
        {text}
      </SvgText>
    </G>
  );
};

export default RailroadBox; // Exporta el componente para su uso en otros diagramas
