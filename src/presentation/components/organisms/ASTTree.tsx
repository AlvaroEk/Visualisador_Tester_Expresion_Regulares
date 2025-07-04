import React from 'react';
import { View, Text } from 'react-native';

// Define la interfaz de un nodo del árbol de sintaxis (AST)
interface ASTNode {
  type: string; // Tipo del nodo (por ejemplo: "Character", "Group", etc.)
  value?: string; // Valor textual del nodo, si aplica
  raw?: string; // Representación original del nodo
  children?: ASTNode[]; // Hijos del nodo
  [key: string]: any; // Otras propiedades dinámicas
}

// Define las props que acepta el componente ASTTree
interface Props {
  ast: ASTNode; // Nodo raíz del árbol de sintaxis
  textColor?: string; // Color de texto personalizado (opcional)
}

// Función recursiva que renderiza el árbol de sintaxis con estilo visual tipo "rama"
const renderAST = (
  node: ASTNode,
  prefix = '', // Espaciado inicial del nodo
  isLast = true, // Indica si es el último nodo hijo
  color = '#000' // Color del texto
): React.ReactNode => {
  const connector = isLast ? '└─ ' : '├─ '; // Conector visual
  const nextPrefix = prefix + (isLast ? '   ' : '│  '); // Espaciado para el siguiente nivel

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

// Componente visual que muestra el árbol de sintaxis abstracta
export const ASTTree: React.FC<Props> = ({ ast, textColor = '#000' }) => {
  return (
    <View style={{ padding: 8 }}>
      {/* Título del árbol */}
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6, color: textColor }}>
        Árbol de Sintaxis:
      </Text>

      {/* Renderiza el AST recursivamente */}
      {renderAST(ast, '', true, textColor)}
    </View>
  );
};
