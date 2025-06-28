import React from 'react';
import { View, Text } from 'react-native';

interface ASTNode {
  type: string;
  value?: string;
  raw?: string;
  children?: ASTNode[];
  [key: string]: any;
}

interface Props {
  ast: ASTNode;
  textColor?: string;
}

const renderAST = (
  node: ASTNode,
  prefix = '',
  isLast = true,
  color = '#000'
): React.ReactNode => {
  const connector = isLast ? '└─ ' : '├─ ';
  const nextPrefix = prefix + (isLast ? '   ' : '│  ');

  return (
    <View key={`${node.type}-${Math.random()}`}>
      <Text style={{ fontFamily: 'monospace', color }}>
        {prefix}
        {connector}
        <Text style={{ fontWeight: 'bold', color }}>{node.type}</Text>
        {node.value !== undefined && <Text style={{ color }}>{`: ${node.value}`}</Text>}
        {node.raw !== undefined && <Text style={{ color }}>{`: ${node.raw}`}</Text>}
      </Text>

      {Object.entries(node)
        .filter(([_, val]) => typeof val === 'object' && val !== null && (val.type || Array.isArray(val)))
        .flatMap(([_, val], i, arr) => {
          const isLastChild = i === arr.length - 1;
          return Array.isArray(val)
            ? val.map((child, j) =>
                renderAST(child, nextPrefix, j === val.length - 1, color)
              )
            : [renderAST(val as ASTNode, nextPrefix, isLastChild, color)];
        })}
    </View>
  );
};

export const ASTTree: React.FC<Props> = ({ ast, textColor = '#000' }) => {
  return (
    <View style={{ padding: 8 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6, color: textColor }}>
        Árbol de Sintaxis:
      </Text>
      {renderAST(ast, '', true, textColor)}
    </View>
  );
};
