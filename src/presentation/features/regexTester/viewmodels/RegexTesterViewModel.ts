import { makeAutoObservable } from 'mobx'; // o Zustand, o tu elección de state manager
import { RegexExpression } from '../../../../domain/entities/RegexExpression';
import { MatchResult } from '../../../../domain/entities/MatchResult';
import { ParseRegexUseCase } from '../../../../domain/usecases/ParseRegexUseCase';

export class RegexTesterViewModel {
  inputText: string = '';
  pattern: string = '';
  flags: string = '';
  result: MatchResult | null = null;

  constructor(private parseRegexUseCase: ParseRegexUseCase) {
    makeAutoObservable(this); // observable reactivo
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

  private tryParse() {
    try {
      const expression: RegexExpression = {
        pattern: this.pattern,
        flags: this.flags,
      };
      this.result = this.parseRegexUseCase.execute(this.inputText, expression);
    } catch (error) {
      this.result = null; // podrías manejar errores mejor
    }
  }
}
