// Importa MobX para manejo de estado observable y acciones seguras
import { makeAutoObservable, runInAction } from 'mobx';
// Importa la entidad que representa el resultado de la evaluación de una expresión regular
import { MatchResult } from '../../../../domain/entities/MatchResult';
// Importa el caso de uso para parsear la expresión regular
import { ParseRegexUseCase } from '../../../../domain/usecases/ParseRegexUseCase';
// Importa el store de historial para guardar expresiones usadas
import { useHistoryStore } from '../../../../store/historyStore';
// Importa la entidad que representa una expresión regular
import { RegexExpression } from '../../../../domain/entities/RegexExpression';

// Interfaz para representar visualmente un nodo del AST en el diagrama
export interface ASTNodeVisual {
  id: string;     // ID único del nodo
  label: string;  // Texto que se muestra en el nodo
  x: number;      // Posición horizontal
  y: number;      // Posición vertical
}

// ViewModel para controlar el comportamiento del tester de expresiones regulares
export class RegexTesterViewModel {
  inputText = '';               // Texto sobre el cual se aplica la regex
  pattern = '';                 // Patrón de la expresión regular
  flags = '';                   // Flags (g, i, m, etc.)
  result: MatchResult | null = null;  // Resultado de aplicar la expresión
  flagError: string | null = null;    // Error por flags inválidos

  // Constructor que recibe el caso de uso para ejecutar regex
  constructor(private readonly useCase: ParseRegexUseCase) {
    makeAutoObservable(this); // Convierte todas las propiedades y métodos en observables por MobX
    useHistoryStore.getState().loadHistory(); // Carga el historial de uso
  }

  // Ejecuta la expresión regular y actualiza el resultado y errores
  async runRegex() {
    try {
      const expression: RegexExpression = {
        pattern: this.pattern,
        flags: this.flags,
      };

      // Ejecuta la lógica de regex usando el caso de uso
      const result = this.useCase.execute(this.inputText, expression);

      // Actualiza el resultado de forma segura dentro de MobX
      runInAction(() => {
        this.result = result;
        this.flagError = null;
      });

      // Si hay patrón y texto, guarda en el historial
      if (this.pattern && this.inputText) {
        await useHistoryStore.getState().addHistory(this.pattern, this.inputText, this.flags);
      }
    } catch (err) {
      // Si ocurre error, actualiza el flagError
      runInAction(() => {
        this.flagError = (err as Error).message;
      });
    }
  }

  // Setters reactivos que actualizan los valores y ejecutan el análisis de forma diferida
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

  // Manejo de debounce para no ejecutar la regex en cada pulsación
  private debounceTimer: NodeJS.Timeout | null = null;
  private debouncedRun() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer); // Limpia anterior
    this.debounceTimer = setTimeout(() => {
      this.runRegex(); // Ejecuta tras 300ms de pausa
    }, 300);
  }

  // Transforma el AST en una estructura visual con nodos y conexiones
  getVisualASTNodes() {
    if (!this.result?.ast) return { nodes: [], connections: [] }; // Si no hay AST, devuelve vacío

    const visualNodes: ASTNodeVisual[] = []; // Lista de nodos para renderizar
    const connections: { from: string; to: string }[] = []; // Conexiones entre nodos

    let nodeId = 0;                          // Contador incremental de IDs
    const levelMap: Record<number, number> = {}; // Mapea profundidad con posición horizontal
    const visited = new Set();              // Evita ciclos infinitos
    const MAX_DEPTH = 30;                   // Profundidad máxima permitida
    const MAX_NODES = 300;                  // Número máximo de nodos renderizables

    // Función recursiva que recorre el AST y lo transforma en nodos visuales
    const traverse = (
      node: any,
      depth: number = 0,
      parentId: string | null = null
    ) => {
      if (!node || typeof node !== 'object') return; // Nodo inválido
      if (visited.has(node)) return;                 // Ya fue visitado
      if (depth > MAX_DEPTH || visualNodes.length >= MAX_NODES) return;

      visited.add(node); // Marca como visitado

      // Ignora nodos simples tipo caracter
      if (node.type === 'character' || node.type === 'literal') return;

      const id = `node-${nodeId++}`; // Genera ID único
      const xSpacing = 180;
      const ySpacing = 100;

      if (!levelMap[depth]) levelMap[depth] = 0;
      const x = 100 + levelMap[depth] * xSpacing;
      const y = 50 + depth * ySpacing;
      levelMap[depth]++;

      // Extrae el texto a mostrar como etiqueta del nodo
      const label =
        node.raw || node.pattern || node.value || node.type || 'Nodo';

      // Agrega nodo visual a la lista
      visualNodes.push({ id, label, x, y });

      // Agrega conexión si tiene padre
      if (parentId) {
        connections.push({ from: parentId, to: id });
      }

      // Recorre hijos si son array
      if (Array.isArray(node.children)) {
        node.children.forEach((child: any) =>
          traverse(child, depth + 1, id)
        );
      } 
      // Recorre nodos binarios (left, right)
      else if (node.left || node.right) {
        if (node.left) traverse(node.left, depth + 1, id);
        if (node.right) traverse(node.right, depth + 1, id);
      }
      // Recorre nodo hijo único
      else if (node.child) {
        traverse(node.child, depth + 1, id);
      }
    };

    // Inicia el recorrido desde el nodo raíz del AST
    traverse(this.result.ast);

    // Devuelve los nodos y conexiones listos para visualizar
    return { nodes: visualNodes, connections };
  }
}
