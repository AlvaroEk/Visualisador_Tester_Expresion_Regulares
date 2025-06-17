import { RegexExpression } from '../entities/RegexExpression';
import { MatchResult } from '../entities/MatchResult';

export interface RegexRepository {
  parse(input: string, expression: RegexExpression): MatchResult;
}
