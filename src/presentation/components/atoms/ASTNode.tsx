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
  return (
    <G key={id}>
      <Circle cx={cx} cy={cy} r={radius} fill={fill} stroke={stroke} strokeWidth={2} />
      <SvgText
        x={cx}
        y={cy + fontSize * 0.35}
        fontSize={fontSize}
        fontWeight="bold"
        fill={textColor}
        textAnchor="middle"
      >
        {label}
      </SvgText>
    </G>
  );
};

export default ASTNode;
