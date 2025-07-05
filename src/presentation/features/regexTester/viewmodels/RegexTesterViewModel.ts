import { makeAutoObservable, runInAction } from 'mobx';
import { MatchResult } from '../../../../domain/entities/MatchResult';
import { ParseRegexUseCase } from '../../../../domain/usecases/ParseRegexUseCase';
import { useHistoryStore } from '../../../../store/historyStore';
import { RegexExpression } from '../../../../domain/entities/RegexExpression';

export interface ASTNodeVisual {
  id: string;
  label: string;
  x: number;
  y: number;
}

export class RegexTesterViewModel {
  inputText = '';
  pattern = '';
  flags = '';
  result: MatchResult | null = null;
  flagError: string | null = null;

  constructor(private readonly useCase: ParseRegexUseCase) {
    makeAutoObservable(this);
    useHistoryStore.getState().loadHistory();
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

  private debounceTimer: NodeJS.Timeout | null = null;
  private debouncedRun() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.runRegex();
    }, 300);
  }

  // ✅ Genera un árbol jerárquico tipo organigrama (sin letras sueltas)
  getVisualASTNodes() {
    if (!this.result?.ast) return { nodes: [], connections: [] };

    const visualNodes: ASTNodeVisual[] = [];
    const connections: { from: string; to: string }[] = [];

    let nodeId = 0;
    const levelMap: Record<number, number> = {};

    const traverse = (
      node: any,
      depth: number = 0,
      parentId: string | null = null
    ) => {
      if (!node || typeof node !== 'object') return;

      // Excluir caracteres individuales
      if (node.type === 'character' || node.type === 'literal') return;

      const id = `node-${nodeId++}`;
      const xSpacing = 180;
      const ySpacing = 100;

      if (!levelMap[depth]) levelMap[depth] = 0;
      const x = 100 + levelMap[depth] * xSpacing;
      const y = 50 + depth * ySpacing;
      levelMap[depth]++;

      const label =
        node.raw ||
        node.pattern ||
        node.value ||
        node.type ||
        'Nodo';

      visualNodes.push({ id, label, x, y });

      if (parentId) {
        connections.push({ from: parentId, to: id });
      }

      if (Array.isArray(node.children)) {
        node.children.forEach((child: any) => traverse(child, depth + 1, id));
      } else if (node.left || node.right) {
        if (node.left) traverse(node.left, depth + 1, id);
        if (node.right) traverse(node.right, depth + 1, id);
      } else if (node.child) {
        traverse(node.child, depth + 1, id);
      }
    };

    traverse(this.result.ast);

    return { nodes: visualNodes, connections };
  }
}
