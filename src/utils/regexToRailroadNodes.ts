// Importa el parser de expresiones regulares y tipos del AST de la librería regexpp
import { RegExpParser } from 'regexpp';
import type {
  Alternative,
  Element,
  Character,
  CharacterClass,
  CharacterSet,
  Backreference,
  Assertion,
  CapturingGroup,
  Group,
  Quantifier,
  Pattern,
} from 'regexpp/ast';

// Tipo de nodo visual que será usado para construir el diagrama de ferrocarril
export interface RailroadVisualNode {
  type: 'start' | 'end' | 'text' | 'group' | 'sequence'; // Tipos posibles de nodo
  label?: string; // Texto que aparecerá dentro del nodo (opcional)
  children?: RailroadVisualNode[]; // Subnodos hijos (para grupos o secuencias)
}

// Función principal que convierte un patrón RegEx en un array de nodos visuales
export function parseRegexToRailroadNodes(pattern: string): RailroadVisualNode[] {
  try {
    const parser = new RegExpParser();
    const ast: Pattern = parser.parsePattern(pattern, 0, pattern.length, false); // Parsea la expresión regular

    // Caso especial: patrones simples con palabras separadas por |, como FELIZ|TRISTE|ENOJADO
    if (/^(\w+)(\|\w+)+$/.test(pattern)) {
      return pattern.split('|').map((word) => ({
        type: 'sequence',
        children: [
          { type: 'start' }, // Nodo de inicio
          ...word.split('').map(
            (char): RailroadVisualNode => ({
              type: 'text', // Un nodo por cada letra
              label: char,
            })
          ),
          { type: 'end' }, // Nodo de fin
        ],
      }));
    }

    // Caso general: expresión regular compleja, convertir usando el AST
    return ast.alternatives.map(convertAlternative);
  } catch (error) {
    console.error('Error al parsear patrón RegEx:', error);
    // Si ocurre un error, se devuelve un nodo que indique el fallo
    return [{ type: 'text', label: 'Error al parsear expresión' }];
  }
}

// Convierte una alternativa (una secuencia posible del regex) en un nodo de tipo 'sequence'
function convertAlternative(alt: Alternative): RailroadVisualNode {
  const children = alt.elements.map(el => convertElement(el)); // Convierte cada elemento
  return {
    type: 'sequence',
    children: [
      { type: 'start' }, // Nodo inicial
      ...children,       // Nodos intermedios
      { type: 'end' }    // Nodo final
    ]
  };
}

// Convierte un nodo del AST en un nodo visual de tipo RailroadVisualNode
function convertElement(el: Element): RailroadVisualNode {
  switch (el.type) {
    case 'Character':
    case 'CharacterClass':
    case 'CharacterSet':
    case 'Backreference':
      // Tipos que se pueden representar directamente como texto
      return { type: 'text', label: el.raw };

    case 'Assertion':
      // Afirmaciones como ^, $, \b se colocan como un grupo sin hijos
      return { type: 'group', label: el.raw, children: [] };

    case 'CapturingGroup':
    case 'Group':
      // Agrupaciones con subalternativas; se extraen y se aplanan los hijos
      return {
        type: 'group',
        label: el.raw,
        children: el.alternatives.flatMap(convertAlternative).flatMap(n => n.children ?? [])
      };

    case 'Quantifier':
      // Cuantificadores como *, +, ? aplicados sobre otro nodo
      const child = convertElement(el.element);
      return {
        type: 'group',
        label: el.raw,
        children: [child]
      };

    default:
      // Cualquier otro tipo desconocido se representa como texto genérico
      return { type: 'text', label: 'desconocido' };
  }
}
