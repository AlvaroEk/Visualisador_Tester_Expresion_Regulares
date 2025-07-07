import React from 'react';
import { Rect } from 'react-native-svg';

interface ASTGridProps {
  width: number;
  height: number;
  backgroundColor: string;
  gridColor: string;
}

const ASTGrid: React.FC<ASTGridProps> = ({
  width,
  height,
  backgroundColor,
  gridColor,
}) => {
  if (!width || !height) return null;

  const cellSize = 40;
  const cellsX = Math.ceil(width / cellSize);
  const cellsY = Math.ceil(height / cellSize);

  return (
    <>
      {/* Fondo completo */}
      <Rect width={width} height={height} fill={backgroundColor} />

      {/* Celdas de la cuadrícula */}
      {[...Array(cellsY)].map((_, y) =>
        [...Array(cellsX)].map((_, x) => (
          <Rect
            key={`${x}-${y}`}
            x={x * cellSize}
            y={y * cellSize}
            width={cellSize}
            height={cellSize}
            fill="none"
            stroke={gridColor}
            strokeWidth={0.3}
          />
        ))
      )}
    </>
  );
};

export default ASTGrid;
