import React from 'react';
import { Line } from 'react-native-svg';

interface Props {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const RailroadConnection: React.FC<Props> = ({ x1, y1, x2, y2 }) => {
  return (
    <Line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#000"
      strokeWidth={2}
    />
  );
};

export default RailroadConnection;
