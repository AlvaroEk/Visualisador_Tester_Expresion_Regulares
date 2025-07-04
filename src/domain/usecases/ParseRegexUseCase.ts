// Importa la interfaz del repositorio de expresiones regulares desde la capa de dominio
import { RegexRepository } from '../repositories/RegexRepository';
// Importa la interfaz que define la estructura del resultado de una expresión regular
import { MatchResult } from '../entities/MatchResult';
// Importa la interfaz que representa una expresión regular (patrón + flags)
import { RegexExpression } from '../entities/RegexExpression';

// Define un caso de uso llamado ParseRegexUseCase que encapsula la lógica de parseo de expresiones regulares
export class ParseRegexUseCase {
  // Inyecta una instancia del repositorio a través del constructor (principio de inversión de dependencias)
  constructor(private regexRepo: RegexRepository) {}

  // Ejecuta el caso de uso: analiza una cadena usando la expresión regular dada
  execute(input: string, expression: RegexExpression): MatchResult {
    // Delegación directa al repositorio para obtener el resultado del análisis
    return this.regexRepo.parse(input, expression);
  }
}
