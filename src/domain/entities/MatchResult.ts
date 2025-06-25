export interface MatchResult {
  matches: string[];
  indices: [number, number][];
  ast: ASTNode | null;
}

export interface ASTNode {
  type: string;
  value?: string;
  raw?: string;
  children?: ASTNode[];
  [key: string]: any; // permite nodos arbitrarios del AST real
}
