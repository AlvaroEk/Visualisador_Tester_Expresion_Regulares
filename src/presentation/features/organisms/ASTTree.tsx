import React from 'react';
import { View, Text, useColorScheme } from 'react-native';

interface ASTNode {
  type: string;
  value?: string;
  raw?: string;
  children?: ASTNode[];
  [key: string]: any;
}

const renderAST = (node: ASTNode, depth = 0, color: string): React.ReactElement => {
  const indent = { marginLeft: depth * 12, marginVertical: 2 };

  return (
    <View key={`${node.type}-${Math.random()}`} style={indent}>
      <Text style={{ color }}>
        <Text style={{ fontWeight: 'bold' }}>{node.type}</Text>
        {node.value !== undefined && `: ${node.value}`}
        {node.raw !== undefined && `: ${node.raw}`}
      </Text>
      {Object.entries(node)
        .filter(([_, val]) => typeof val === 'object' && val !== null && (val.type || Array.isArray(val)))
        .map(([_, val]) => {
          if (Array.isArray(val)) {
            return val.map((child, i) => renderAST(child, depth + 1, color));
          }
          return renderAST(val as ASTNode, depth + 1, color);
        })}
    </View>
  );
};

export const ASTTree: React.FC<{ ast: ASTNode }> = ({ ast }) => {
  const scheme = useColorScheme();
  const color = scheme === 'dark' ? '#ffffff' : '#000000';

  return (
    <View style={{ padding: 8 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 6, fontSize: 16, color }}>
        Árbol de Sintaxis:
      </Text>
      {renderAST(ast, 0, color)}
    </View>
  );
};
