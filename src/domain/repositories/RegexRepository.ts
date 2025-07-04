// Importa la interfaz RegexExpression que representa una expresión regular con patrón y flags
import { RegexExpression } from '../entities/RegexExpression';

// Importa la interfaz MatchResult que representa el resultado del análisis de una expresión regular
import { MatchResult } from '../entities/MatchResult';

// Define la interfaz RegexRepository que actúa como contrato para los repositorios de expresiones regulares
export interface RegexRepository {
  // Método que analiza una cadena de entrada usando una expresión regular y devuelve el resultado
  parse(input: string, expression: RegexExpression): MatchResult;
}
