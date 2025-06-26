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
  flagError: string | null = null;

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
    const validFlags = 'gimsuy';
    const invalid = this.flags.split('').filter(f => !validFlags.includes(f));

    if (invalid.length > 0) {
      this.flagError = `Flags inválidos: ${invalid.join(', ')}`;
      this.result = null;
      return;
    } else {
      this.flagError = null;
    }

    try {
      const expression: RegexExpression = {
        pattern: this.pattern,
        flags: this.flags,
      };

      const parsed = this.parseRegexUseCase.execute(this.inputText, expression);
      this.result = parsed;

      // Guarda en historial
      await RegexHistoryService.saveExpression(this.pattern, this.flags);
    } catch (error) {
      this.result = null;
      console.warn('Error al analizar expresión:', error);
    }
  }
}
