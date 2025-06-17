import { RegexRepository } from '../repositories/RegexRepository';
import { MatchResult } from '../entities/MatchResult';
import { RegexExpression } from '../entities/RegexExpression';

export class ParseRegexUseCase {
  constructor(private regexRepo: RegexRepository) {}

  execute(input: string, expression: RegexExpression): MatchResult {
    return this.regexRepo.parse(input, expression);
  }
}
