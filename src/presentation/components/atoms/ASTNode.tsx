import React from 'react';
import { Circle, Text as SvgText, G } from 'react-native-svg';

interface ASTNodeProps {
  id: string;
  label: string;
  cx: number;
  cy: number;
  radius: number;
  fontSize: number;
  fill: string;
  stroke: string;
  textColor?: string;
}

const ASTNode: React.FC<ASTNodeProps> = ({
  id,
  label,
  cx,
  cy,
  radius,
  fontSize,
  fill,
  stroke,
  textColor = '#000000',
}) => {
  // Protección ante valores incorrectos
  if (typeof cx !== 'number' || typeof cy !== 'number' || typeof radius !== 'number') {
    console.warn(`Nodo con datos inválidos ignorado: ${id}`);
    return null;
  }

  // Limita el texto si es demasiado largo
  const maxChars = 20;
  const displayLabel = label.length > maxChars ? label.slice(0, maxChars - 3) + '...' : label;

  return (
    <G key={id}>
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
      />
      <SvgText
        x={cx}
        y={cy + fontSize * 0.35} // Ajuste visual para centrar verticalmente
        fontSize={fontSize}
        fontWeight="bold"
        fill={textColor}
        textAnchor="middle"
      >
        {displayLabel}
      </SvgText>
    </G>
  );
};

export default ASTNode;
