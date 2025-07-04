// Define la interfaz ASTNode que representa un nodo del Árbol de Sintaxis Abstracta (AST) de una expresión regular
export interface ASTNode {
  // Tipo del nodo (por ejemplo: "Character", "Group", "Alternative", etc.)
  type: string;

  // Valor asociado al nodo, si aplica (por ejemplo, un carácter literal)
  value?: string;

  // Representación textual del nodo tal como aparece en la expresión regular
  raw?: string;

  // Arreglo de nodos hijos que componen este nodo (estructura recursiva del AST)
  children: ASTNode[];
}

// Define la interfaz MatchResult que representa el resultado completo del análisis de una expresión regular
export interface MatchResult {
  // Lista de coincidencias encontradas en el texto
  matches: string[];

  // Lista de tuplas con los índices [inicio, fin] de cada coincidencia
  indices: [number, number][];

  // Árbol de sintaxis abstracta generado a partir del patrón de la expresión regular
  ast: ASTNode | null;
}
