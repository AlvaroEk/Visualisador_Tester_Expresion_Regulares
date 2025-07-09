import React from 'react';
import { Circle } from 'react-native-svg';

interface Props {
  cx: number;
  cy: number;
  type: 'start' | 'end';
}

const RailroadNode: React.FC<Props> = ({ cx, cy, type }) => {
  return (
    <Circle
      cx={cx}
      cy={cy}
      r={6}
      fill={type === 'start' ? 'green' : 'red'}
    />
  );
};

export default RailroadNode;
