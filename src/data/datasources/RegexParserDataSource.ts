import { RegexExpression } from '../../domain/entities/RegexExpression';
import { MatchResult } from '../../domain/entities/MatchResult';
import { parse } from 'regexp-tree';

export class RegexParserDataSource {
  parseRegex(input: string, expression: RegexExpression): MatchResult {
    const regex = new RegExp(expression.pattern, expression.flags);
    const matches: string[] = [];
    const indices: [number, number][] = [];

    let match: RegExpExecArray | null;
    while ((match = regex.exec(input)) !== null) {
      matches.push(match[0]);
      indices.push([match.index, match.index + match[0].length]);
      if (!regex.global) break;
    }

    const ast = this.generateRealAST(expression.pattern, expression.flags);

    return {
      matches,
      indices,
      ast,
    };
  }

  private generateRealAST(pattern: string, flags: string) {
    try {
      return parse(`/${pattern}/${flags}`).body;
    } catch (error) {
      return {
        type: 'Error',
        value: 'Expresión inválida',
      };
    }
  }
}
