import React from 'react';
import { View, Text } from 'react-native';
import { ASTNode } from '../../../domain/entities/MatchResult';

// Contador para claves únicas
let uniqueId = 0;

// Función recursiva para renderizar el árbol AST
const renderAST = (node: ASTNode, depth = 0): React.ReactElement => {
  const currentId = uniqueId++;
  return (
    <View
      key={`${node.type}-${node.value ?? 'null'}-${depth}-${currentId}`}
      style={{ marginLeft: depth * 12, marginVertical: 2 }}
    >
      <Text>{`${node.type}${node.value ? `: ${node.value}` : ''}`}</Text>
      {node.children?.map((child) => renderAST(child, depth + 1))}
    </View>
  );
};

// Componente principal
export const ASTTree: React.FC<{ ast: ASTNode }> = ({ ast }) => {
  uniqueId = 0; // Reiniciar el contador al renderizar
  return (
    <View style={{ padding: 8 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 6, fontSize: 16 }}>
        Árbol de Sintaxis:
      </Text>
      {renderAST(ast)}
    </View>
  );
};
