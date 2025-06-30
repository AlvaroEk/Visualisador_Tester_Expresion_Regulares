export interface ASTNode {
  type: string;
  value?: string;
  raw?: string;
  children: ASTNode[];
}

export interface MatchResult {
  matches: string[];
  indices: [number, number][];
  ast: ASTNode | null;
}
