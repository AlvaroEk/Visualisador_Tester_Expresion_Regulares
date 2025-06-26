import { makeAutoObservable } from 'mobx';
import { RegexExpression } from '../../../../domain/entities/RegexExpression';
import { MatchResult } from '../../../../domain/entities/MatchResult';
import { ParseRegexUseCase } from '../../../../domain/usecases/ParseRegexUseCase';
import { RegexHistoryService } from '../../../../services/regexHistoryService';

export class RegexTesterViewModel {
  inputText: string = '';
  pattern: string = '';
  flags: string = '';
  flagError: string = '';
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
      const validFlags = 'gimsuy';
      const flagSet = new Set(this.flags.split(''));

      for (const flag of flagSet) {
        if (!validFlags.includes(flag)) {
          this.flagError = `Flag inválida: "${flag}"`;
          this.result = null;
          return;
        }
      }

      this.flagError = ''; // todo válido

      const expression: RegexExpression = {
        pattern: this.pattern,
        flags: [...flagSet].join(''),
      };

      this.result = this.parseRegexUseCase.execute(this.inputText, expression);
      await RegexHistoryService.saveExpression(expression.pattern, expression.flags);
    } catch (error) {
      this.flagError = 'Error al procesar la expresión';
      this.result = null;
    }
  }
}
