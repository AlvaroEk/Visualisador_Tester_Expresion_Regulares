// Importa la interfaz del repositorio que define el contrato del dominio
import { RegexRepository } from '../../domain/repositories/RegexRepository';
// Importa la estructura de datos que representa el resultado del análisis de una expresión regular
import { MatchResult } from '../../domain/entities/MatchResult';
// Importa la fuente de datos responsable de parsear expresiones regulares
import { RegexParserDataSource } from '../datasources/RegexParserDataSource';
// Importa la entidad que representa una expresión regular compuesta por patrón y flags
import { RegexExpression } from '../../domain/entities/RegexExpression';

// Implementación concreta del repositorio de expresiones regulares
export class RegexRepositoryImpl implements RegexRepository {
  // Constructor que recibe una instancia del datasource (inyección de dependencia)
  constructor(private readonly dataSource: RegexParserDataSource) {}

  // Método que analiza una expresión regular sobre una cadena de entrada
  parse(input: string, expression: RegexExpression): MatchResult {
    // Llama al método parseRegex del datasource usando el patrón y flags de la expresión
    return this.dataSource.parseRegex(input, expression.pattern, expression.flags);
  }
}
