// Importa la interfaz ASTNode que representa un nodo del árbol de sintaxis abstracta de una expresión regular
import { ASTNode } from '../../domain/entities/MatchResult';

// Función que transforma un nodo AST genérico (proveniente de regexpp) al formato definido en el dominio (ASTNode)
export const mapToASTNode = (node: any): ASTNode | null => {
  // Si el nodo es nulo o no es un objeto, retorna null
  if (!node || typeof node !== 'object') return null;

  // Retorna un objeto ASTNode con propiedades mapeadas desde el nodo original
  return {
    // Tipo del nodo (por ejemplo: "Character", "Group", etc.)
    type: node.type,

    // Valor del nodo si es una cadena (algunos nodos tienen `value`, otros no)
    value: typeof node.value === 'string' ? node.value : undefined,

    // Representación en texto del nodo, si está disponible
    raw: node.raw ?? undefined,

    // Los hijos del nodo se toman de `elements`, `alternatives` o `expressions`, según corresponda
    children: Array.isArray(node.elements || node.alternatives || node.expressions)
      ? (node.elements || node.alternatives || node.expressions)
          // Se aplica recursivamente mapToASTNode a cada hijo
          .map(mapToASTNode)
          // Se eliminan valores nulos con filter(Boolean)
          .filter(Boolean) as ASTNode[]
      : [], // Si no hay hijos, retorna un arreglo vacío
  };
};
