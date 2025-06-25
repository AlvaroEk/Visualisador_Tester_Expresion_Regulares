import { makeAutoObservable } from 'mobx';
import { RegexExpression } from '../../../../domain/entities/RegexExpression';
import { MatchResult } from '../../../../domain/entities/MatchResult';
import { ParseRegexUseCase } from '../../../../domain/usecases/ParseRegexUseCase';
import { RegexHistoryService } from '../../../../services/regexHistoryService';

export class RegexTesterViewModel {
  inputText: string = '';
  pattern: string = '';
  flags: string = '';
  result: MatchResult | null = null;

  constructor(private parseRegexUseCase: ParseRegexUseCase) {
    makeAutoObservable(this);
  }

  setInputText(text: string) {
    this.inputText = text;
    this.tryParse();
  }

  setPattern(pattern: string) {
    this.pattern = pattern;
    this.tryParse();
  }

  setFlags(flags: string) {
    this.flags = flags;
    this.tryParse();
  }

  private async tryParse() {
    try {
      if (!/^[gimsuy]*$/.test(this.flags)) {
        this.result = null;
        return;
      }

      const expression: RegexExpression = {
        pattern: this.pattern,
        flags: this.flags,
      };

      this.result = this.parseRegexUseCase.execute(this.inputText, expression);

      await RegexHistoryService.saveExpression(this.pattern, this.flags);
    } catch (error) {
      this.result = null;
    }
  }
}
