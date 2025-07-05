import React from 'react';
import Svg from 'react-native-svg';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../../../store/themeStore';
import ASTNode from '../atoms/ASTNode';
import ASTConnection from '../atoms/ASTConnection';
import ASTDefs from '../atoms/ASTDefs';
import ASTGrid from '../atoms/ASTGrid';
import { Node, Connection } from '../../../types/types';

interface Props {
  nodes: Node[];
  connections: Connection[];
}

const ASTDiagram: React.FC<Props> = observer(({ nodes, connections }) => {
  const isDarkMode = themeStore.resolvedMode === 'dark';

  const padding = 250;
  const spacingX = 20;
  const spacingY = 30;

  const width = Math.max(...nodes.map((n) => n.x + spacingX)) + padding;
  const height = Math.max(...nodes.map((n) => n.y + spacingY)) + padding;

  const backgroundColor = isDarkMode ? '#0f172a' : '#e3f2fd';
  const gridColor = isDarkMode ? '#1e293b' : '#bbdefb';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const strokeColor = isDarkMode ? '#90cdf4' : '#1e88e5';
  const pathColor = isDarkMode ? '#f1f5f9' : '#1e293b';

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <Svg width={width} height={height}>
        <ASTGrid width={width} height={height} backgroundColor={backgroundColor} gridColor={gridColor} />
        <ASTDefs pathColor={pathColor} />

        {connections.map((conn, index) => {
          const from = nodes.find((n) => n.id === conn.from);
          const to = nodes.find((n) => n.id === conn.to);
          if (!from || !to) return null;

          return (
            <ASTConnection
              key={index}
              connection={conn}
              from={from}
              to={to}
              spacingX={spacingX}
              spacingY={spacingY}
              pathColor={pathColor}
              textColor={textColor}
            />
          );
        })}

        {nodes.map((node) => {
          const textLength = node.label.length;
          const baseRadius = 36;
          const maxRadius = 55;
          const radius = Math.min(maxRadius, Math.max(baseRadius, textLength * 4.2));
          const fontSize = Math.max(10, Math.min(16, radius / 3));
          const cx = node.x + spacingX;
          const cy = node.y + spacingY;
          const gradientId = isDarkMode ? 'nodeGradientDark' : 'nodeGradientLight';

          return (
            <ASTNode
              key={node.id}
              id={node.id}
              label={node.label}
              cx={cx}
              cy={cy}
              radius={radius}
              fontSize={fontSize}
              fill={`url(#${gradientId})`}
              stroke={strokeColor}
              textColor={textColor} 
            />
          );
        })}
      </Svg>
    </View>
  );
});

export default ASTDiagram;
