import React from 'react';
import { View, Text } from 'react-native';

interface ASTNode {
  type: string;
  [key: string]: any;
}

const renderAST = (node: ASTNode, depth = 0): React.ReactElement => {
  const indent = { marginLeft: depth * 12, marginVertical: 2 };

  return (
    <View key={`${node.type}-${Math.random()}`} style={indent}>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>{node.type}</Text>
        {node.value !== undefined && `: ${node.value}`}
        {node.raw !== undefined && `: ${node.raw}`}
      </Text>
      {Object.entries(node)
        .filter(([key, val]) => typeof val === 'object' && val !== null && (val.type || Array.isArray(val)))
        .map(([key, val]) => {
          if (Array.isArray(val)) {
            return val.map((child, i) => renderAST(child, depth + 1));
          }
          return renderAST(val as ASTNode, depth + 1);
        })}
    </View>
  );
};

export const ASTTree: React.FC<{ ast: ASTNode }> = ({ ast }) => (
  <View style={{ padding: 8 }}>
    <Text style={{ fontWeight: 'bold', marginBottom: 6, fontSize: 16 }}>Árbol de Sintaxis:</Text>
    {renderAST(ast)}
  </View>
);
