import { MatchResult } from '../../domain/entities/MatchResult';
import { mapToASTNode } from '../mappers/RegexMapper';
import { ASTNode } from '../../domain/entities/MatchResult';

export class RegexParserDataSource {
  parseRegex(text: string, pattern: string, flags: string): MatchResult {
    const validFlags = 'gimsuy';
    const cleanFlags = [...new Set(flags.split('').filter(f => validFlags.includes(f)))].join('');

    let matches: string[] = [];
    let indices: [number, number][] = [];

    try {
      const regex = new RegExp(pattern, cleanFlags);
      matches = [...text.matchAll(regex)].map(m => m[0]);
      indices = [...text.matchAll(regex)].map(m =>
        m.index !== undefined ? [m.index, m.index + m[0].length] as [number, number] : [0, 0]
      );
    } catch (err) {
      const msg = String(err);
      if (!msg.includes('String.prototype.matchAll called with a non-global')) {
        console.warn('Error al analizar expresión:', err);
      }
    }

    let ast: ASTNode | null = null;
    try {
      const { RegExpParser } = require('regexpp');
      const parser = new RegExpParser();
      const parsedAst = parser.parsePattern(pattern, 0, pattern.length, flags.includes('u'));
      ast = mapToASTNode(parsedAst);
    } catch (err) {
      console.warn('No se pudo parsear el AST:', (err as Error).message);
    }

    return {
      matches,
      indices,
      ast,
    };
  }
}
