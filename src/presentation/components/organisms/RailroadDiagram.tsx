import React from 'react';
import Svg from 'react-native-svg';
import { View } from 'react-native';

import RailroadBox from '../atoms/RailroadBox';
import RailroadConnection from '../atoms/RailroadConnection';
import RailroadNode from '../atoms/RailroadNode';

interface Props {
  pattern: string;
}

const BOX_WIDTH = 100;
const BOX_HEIGHT = 40;
const PADDING_X = 40;
const PADDING_Y = 30;
const SPACING_Y = 70;
const CONNECTOR = 20;

const RailroadDiagram: React.FC<Props> = ({ pattern }) => {
  const options = pattern.split('|');
  const totalHeight = options.length * SPACING_Y + PADDING_Y * 2;
  const totalWidth = PADDING_X + BOX_WIDTH + CONNECTOR * 4;

  return (
    <View>
      <Svg width={totalWidth} height={totalHeight}>
        {/* Nodo inicial */}
        <RailroadNode cx={20} cy={totalHeight / 2} type="start" />

        {/* Ramas de alternativas */}
        {options.map((text, i) => {
          const y = PADDING_Y + i * SPACING_Y;
          const boxX = PADDING_X + CONNECTOR * 2;
          const boxY = y;

          // Curva desde nodo inicial hacia cada opción
          const curveD = `M20,${totalHeight / 2} C40,${totalHeight / 2} 40,${boxY + BOX_HEIGHT / 2} ${boxX},${boxY + BOX_HEIGHT / 2}`;
          const exitD = `M${boxX + BOX_WIDTH},${boxY + BOX_HEIGHT / 2} h${CONNECTOR}`;

          return (
            <React.Fragment key={i}>
              <RailroadConnection d={curveD} />
              <RailroadBox
                x={boxX}
                y={boxY}
                width={BOX_WIDTH}
                height={BOX_HEIGHT}
                text={text}
                bold={i === 0}
              />
              <RailroadConnection d={exitD} />
            </React.Fragment>
          );
        })}

        {/* Línea que une todas las salidas al nodo final */}
        <RailroadConnection
          d={`M${PADDING_X + BOX_WIDTH + CONNECTOR * 3},${PADDING_Y + BOX_HEIGHT / 2} 
              V${PADDING_Y + (options.length - 1) * SPACING_Y + BOX_HEIGHT / 2}`}
        />

        {/* Nodo final */}
        <RailroadNode
          cx={PADDING_X + BOX_WIDTH + CONNECTOR * 3 + 10}
          cy={totalHeight / 2}
          type="end"
        />
      </Svg>
    </View>
  );
};

export default RailroadDiagram;
