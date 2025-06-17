import { RegexRepository } from '../../domain/repositories/RegexRepository';
import { RegexExpression } from '../../domain/entities/RegexExpression';
import { MatchResult } from '../../domain/entities/MatchResult';
import { RegexParserDataSource } from '../datasources/RegexParserDataSource';

export class RegexRepositoryImpl implements RegexRepository {
  constructor(private parser: RegexParserDataSource) {}

  parse(input: string, expression: RegexExpression): MatchResult {
    return this.parser.parseRegex(input, expression);
  }
}
