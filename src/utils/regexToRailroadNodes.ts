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
} from 'regexpp/ast';

export interface RailroadVisualNode {
  type: 'start' | 'end' | 'text' | 'group' | 'sequence';
  label?: string;
  children?: RailroadVisualNode[];
}

export function parseRegexToRailroadNodes(pattern: string): RailroadVisualNode[] {
  try {
    const parser = new RegExpParser();
    const ast = parser.parsePattern(pattern, 0, pattern.length, false);
    return ast.alternatives.map(convertAlternative);
  } catch (error) {
    console.error('Error al parsear patrón RegEx:', error);
    return [{ type: 'text', label: 'Error al parsear expresión' }];
  }
}

function convertAlternative(alt: Alternative): RailroadVisualNode {
  const children = alt.elements.map(el => convertElement(el));
  return {
    type: 'sequence',
    children: [
      { type: 'start' },
      ...children,
      { type: 'end' }
    ]
  };
}

function convertElement(el: Element): RailroadVisualNode {
  switch (el.type) {
    case 'Character':
      return { type: 'text', label: (el as Character).raw };

    case 'CharacterClass':
      return { type: 'text', label: (el as CharacterClass).raw };

    case 'CharacterSet':
    case 'Backreference':
      return { type: 'text', label: (el as CharacterSet | Backreference).raw };

    case 'Assertion':
      return { type: 'group', label: (el as Assertion).raw, children: [] };

    case 'CapturingGroup':
    case 'Group':
      return {
        type: 'group',
        label: el.raw,
        children: el.alternatives.flatMap(convertAlternative).flatMap(n => n.children ?? [])
      };

    case 'Quantifier':
      const child = convertElement(el.element);
      return {
        type: 'group',
        label: el.raw,
        children: [child]
      };

    default:
      return { type: 'text', label: 'desconocido' };
  }
}
