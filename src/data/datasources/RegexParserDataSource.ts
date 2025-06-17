import { RegexExpression } from '../../domain/entities/RegexExpression';
import { MatchResult } from '../../domain/entities/MatchResult';

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

    const ast = this.generateMockAST(expression.pattern); // puede usar una lib real luego

    return {
      matches,
      indices,
      ast
    };
  }

  private generateMockAST(pattern: string) {
    // Simulación básica
    return {
      type: 'Root',
      children: pattern.split('').map(c => ({
        type: 'Character',
        value: c
      }))
    };
  }
}
