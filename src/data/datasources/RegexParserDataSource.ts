// Importa la interfaz MatchResult que representa el resultado de un análisis de expresión regular
import { MatchResult } from '../../domain/entities/MatchResult';
// Importa la función que transforma el AST generado por regexpp en el formato ASTNode usado en el dominio
import { mapToASTNode } from '../mappers/RegexMapper';
// Importa la interfaz del nodo AST
import { ASTNode } from '../../domain/entities/MatchResult';

// Define una clase que actúa como fuente de datos para el análisis de expresiones regulares
export class RegexParserDataSource {
  // Método que analiza una expresión regular sobre un texto dado
  parseRegex(text: string, pattern: string, flags: string): MatchResult {
    // Define los flags válidos aceptados por JavaScript
    const validFlags = 'gimsuy';

    // Limpia los flags recibidos, eliminando duplicados y no válidos
    const cleanFlags = [...new Set(flags.split('').filter(f => validFlags.includes(f)))].join('');

    // Inicializa arreglos para almacenar los matches encontrados y sus índices
    let matches: string[] = [];
    let indices: [number, number][] = [];

    try {
      // Crea una nueva expresión regular con los flags válidos
      const regex = new RegExp(pattern, cleanFlags);

      // Extrae todos los matches y los almacena como texto
      matches = [...text.matchAll(regex)].map(m => m[0]);

      // Extrae los índices de inicio y fin de cada match
      indices = [...text.matchAll(regex)].map(m =>
        m.index !== undefined ? [m.index, m.index + m[0].length] as [number, number] : [0, 0]
      );
    } catch (err) {
      // Captura errores de construcción o ejecución del RegExp
      const msg = String(err);
      // Ignora un error específico relacionado con matchAll y no-global, pero registra los demás
      if (!msg.includes('String.prototype.matchAll called with a non-global')) {
        console.warn('Error al analizar expresión:', err);
      }
    }

    // Inicializa el nodo raíz del AST como nulo por defecto
    let ast: ASTNode | null = null;

    try {
      // Importa dinámicamente el parser de expresiones regulares
      const { RegExpParser } = require('regexpp');
      const parser = new RegExpParser();

      // Parsea el patrón como AST usando la bandera 'u' si está presente
      const parsedAst = parser.parsePattern(pattern, 0, pattern.length, flags.includes('u'));

      // Transforma el AST generado en un nodo adaptado al dominio
      ast = mapToASTNode(parsedAst);
    } catch (err) {
      // Muestra advertencia si no se pudo parsear el AST
      console.warn('No se pudo parsear el AST:', (err as Error).message);
    }

    // Devuelve un objeto con los matches encontrados, sus índices y el AST generado
    return {
      matches,
      indices,
      ast,
    };
  }
}
