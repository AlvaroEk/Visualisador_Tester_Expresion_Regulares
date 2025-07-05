import React from 'react';
import { Rect, Text as SvgText } from 'react-native-svg';

interface RailroadBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  bold?: boolean;
}

const RailroadBox: React.FC<RailroadBoxProps> = ({ x, y, width, height, text, bold }) => {
  return (
    <>
      <Rect
        x={x}
        y={y}
        rx={10}
        ry={10}
        width={width}
        height={height}
        stroke="black"
        fill="white"
        strokeWidth={2}
      />
      <SvgText
        x={x + width / 2}
        y={y + height / 2 + 5}
        fontSize={14}
        fontWeight={bold ? 'bold' : 'normal'}
        textAnchor="middle"
      >
        {text}
      </SvgText>
    </>
  );
};

export default RailroadBox;
