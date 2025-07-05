import React from 'react';
import { Rect } from 'react-native-svg';

interface ASTGridProps {
  width: number;
  height: number;
  backgroundColor: string;
  gridColor: string;
}

const ASTGrid: React.FC<ASTGridProps> = ({ width, height, backgroundColor, gridColor }) => {
  const cellsX = Math.ceil(width / 40);
  const cellsY = Math.ceil(height / 40);

  return (
    <>
      <Rect width={width} height={height} fill={backgroundColor} />
      {[...Array(cellsY).keys()].map((y) =>
        [...Array(cellsX).keys()].map((x) => (
          <Rect
            key={`${x}-${y}`}
            x={x * 40}
            y={y * 40}
            width={40}
            height={40}
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
