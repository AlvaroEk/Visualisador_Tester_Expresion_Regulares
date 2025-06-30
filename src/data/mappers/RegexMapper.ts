import { ASTNode } from '../../domain/entities/MatchResult';

export const mapToASTNode = (node: any): ASTNode | null => {
  if (!node || typeof node !== 'object') return null;

  return {
    type: node.type,
    value: typeof node.value === 'string' ? node.value : undefined,
    raw: node.raw ?? undefined,
    children: Array.isArray(node.elements || node.alternatives || node.expressions)
      ? (node.elements || node.alternatives || node.expressions)
          .map(mapToASTNode)
          .filter(Boolean) as ASTNode[]
      : [],
  };
};
