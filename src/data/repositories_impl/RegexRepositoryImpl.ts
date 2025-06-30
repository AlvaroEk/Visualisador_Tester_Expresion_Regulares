// src/data/repositories_impl/RegexRepositoryImpl.ts
import { RegexRepository } from '../../domain/repositories/RegexRepository';
import { MatchResult } from '../../domain/entities/MatchResult';
import { RegexParserDataSource } from '../datasources/RegexParserDataSource';
import { RegexExpression } from '../../domain/entities/RegexExpression';

export class RegexRepositoryImpl implements RegexRepository {
  constructor(private readonly dataSource: RegexParserDataSource) {}

  parse(input: string, expression: RegexExpression): MatchResult {
    return this.dataSource.parseRegex(input, expression.pattern, expression.flags);
  }
}
