import React from 'react';
import { G, Rect, Text as SvgText } from 'react-native-svg';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  bold?: boolean;
}

const RailroadBox: React.FC<Props> = ({ x, y, width, height, text, bold = false }) => {
  return (
    <G>
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
      <SvgText
        x={x + width / 2}
        y={y + height / 2 + 4}
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

export default RailroadBox;
