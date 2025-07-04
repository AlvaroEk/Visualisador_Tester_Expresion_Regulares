// Importa funciones de MobX para hacer la clase observable y ejecutar acciones de forma segura
import { makeAutoObservable, runInAction } from 'mobx';
// Importa la interfaz que representa el resultado del análisis de una expresión regular
import { MatchResult } from '../../../../domain/entities/MatchResult';
// Importa el caso de uso que ejecuta el análisis de expresiones regulares
import { ParseRegexUseCase } from '../../../../domain/usecases/ParseRegexUseCase';
// Importa el store encargado de manejar el historial
import { useHistoryStore } from '../../../../store/historyStore';
// Importa la entidad que representa una expresión regular con patrón y flags
import { RegexExpression } from '../../../../domain/entities/RegexExpression';

// ViewModel que gestiona el estado y lógica de la pantalla RegexTester
export class RegexTesterViewModel {
  inputText = '';                    // Texto de entrada
  pattern = '';                      // Patrón de expresión regular
  flags = '';                        // Flags seleccionadas
  result: MatchResult | null = null; // Resultado del análisis
  flagError: string | null = null;   // Mensaje de error por flags inválidas

  // Constructor que recibe el caso de uso como dependencia
  constructor(private readonly useCase: ParseRegexUseCase) {
    // Hace que todas las propiedades sean observables automáticamente
    makeAutoObservable(this);

    // Carga el historial desde el store al iniciar
    useHistoryStore.getState().loadHistory();
  }

  // Ejecuta el análisis de la expresión regular
  async runRegex() {
    try {
      // Crea el objeto RegexExpression desde el estado actual
      const expression: RegexExpression = {
        pattern: this.pattern,
        flags: this.flags,
      };

      // Ejecuta el caso de uso con el texto y expresión
      const result = this.useCase.execute(this.inputText, expression);

      // Actualiza el resultado en el estado usando MobX
      runInAction(() => {
        this.result = result;
        this.flagError = null; // Borra cualquier error previo
      });

      // Guarda en el historial si hay patrón y texto válidos
      if (this.pattern && this.inputText) {
        await useHistoryStore.getState().addHistory(this.pattern, this.inputText, this.flags);
      }
    } catch (err) {
      // En caso de error, guarda el mensaje en flagError
      runInAction(() => {
        this.flagError = (err as Error).message;
      });
    }
  }

  // Setter para el texto de entrada, ejecuta el análisis de forma diferida
  setInputText(value: string) {
    this.inputText = value;
    this.debouncedRun();
  }

  // Setter para el patrón de expresión regular
  setPattern(value: string) {
    this.pattern = value;
    this.debouncedRun();
  }

  // Setter para las flags de expresión regular
  setFlags(value: string) {
    this.flags = value;
    this.debouncedRun();
  }

  // ✅ Evita ejecutar el análisis en cada pulsación (debounce)
  private debounceTimer: NodeJS.Timeout | null = null;
  private debouncedRun() {
    // Limpia el temporizador anterior si existe
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    // Crea un nuevo temporizador que ejecuta runRegex luego de 300 ms
    this.debounceTimer = setTimeout(() => {
      this.runRegex();
    }, 300);
  }
}
