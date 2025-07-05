import React from 'react';
import { Circle, Path } from 'react-native-svg';

interface NodeProps {
  cx: number;
  cy: number;
  type: 'start' | 'end';
}

const RailroadNode: React.FC<NodeProps> = ({ cx, cy, type }) => {
  if (type === 'start') {
    return <Circle cx={cx} cy={cy} r={5} fill="black" />;
  }

  // Nodo final (cuadrado)
  const size = 10;
  return (
    <Path
      d={`M${cx},${cy - size / 2} h${size} v${size} h-${size} Z`}
      fill="black"
    />
  );
};

export default RailroadNode;
