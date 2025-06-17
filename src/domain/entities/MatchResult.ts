export interface MatchResult {
  matches: string[];
  indices: [number, number][];
  ast: ASTNode; // definiremos ASTNode luego
}

export interface ASTNode {
  type: string;
  value?: string;
  children?: ASTNode[];
}
