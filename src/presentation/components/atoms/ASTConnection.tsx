import React from 'react';
import { G, Path, Text as SvgText } from 'react-native-svg';
import { Connection, Node } from '../../../types/types';

interface ASTConnectionProps {
  connection: Connection;
  from: Node;
  to: Node;
  spacingX: number;
  spacingY: number;
  pathColor: string;
  textColor: string;
}

const ASTConnection: React.FC<ASTConnectionProps> = ({
  connection,
  from,
  to,
  spacingX,
  spacingY,
  pathColor,
  textColor,
}) => {
  const fromX = from.x + spacingX;
  const fromY = from.y + spacingY;
  const toX = to.x + spacingX;
  const toY = to.y + spacingY;
  const midX = (fromX + toX) / 2;

  return (
    <G>
      <Path
        d={`M${fromX},${fromY} Q${midX},${fromY} ${toX},${toY}`}
        stroke={pathColor}
        strokeWidth={1.5}
        fill="none"
        markerEnd="url(#arrow)"
      />
      {connection.label && (
        <SvgText
          x={midX}
          y={(fromY + toY) / 2 - 10}
          fontSize="10"
          fill={textColor}
          textAnchor="middle"
        >
          {connection.label}
        </SvgText>
      )}
    </G>
  );
};

export default ASTConnection;
