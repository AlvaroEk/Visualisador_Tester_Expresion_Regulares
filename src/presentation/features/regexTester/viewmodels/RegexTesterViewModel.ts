import { makeAutoObservable, runInAction } from 'mobx';
import { MatchResult } from '../../../../domain/entities/MatchResult';
import { ParseRegexUseCase } from '../../../../domain/usecases/ParseRegexUseCase';
import { useHistoryStore } from '../../../../store/historyStore';
import { RegexExpression } from '../../../../domain/entities/RegexExpression';

export class RegexTesterViewModel {
  inputText = '';
  pattern = '';
  flags = '';
  result: MatchResult | null = null;
  flagError: string | null = null;

  constructor(private readonly useCase: ParseRegexUseCase) {
    makeAutoObservable(this);
    useHistoryStore.getState().loadHistory(); // Cargar historial al iniciar
  }

  async runRegex() {
    try {
      const expression: RegexExpression = {
        pattern: this.pattern,
        flags: this.flags,
      };

      const result = this.useCase.execute(this.inputText, expression);

      runInAction(() => {
        this.result = result;
        this.flagError = null;
      });

      if (this.pattern && this.inputText) {
        await useHistoryStore.getState().addHistory(this.pattern, this.inputText, this.flags);
      }
    } catch (err) {
      runInAction(() => {
        this.flagError = (err as Error).message;
      });
    }
  }

  setInputText(value: string) {
    this.inputText = value;
    this.debouncedRun();
  }

  setPattern(value: string) {
    this.pattern = value;
    this.debouncedRun();
  }

  setFlags(value: string) {
    this.flags = value;
    this.debouncedRun();
  }

  // ✅ Evita ejecutar el parser en cada pulsación, opcional
  private debounceTimer: NodeJS.Timeout | null = null;
  private debouncedRun() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.runRegex();
    }, 300);
  }
}
