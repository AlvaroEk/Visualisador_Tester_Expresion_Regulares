import { create } from 'zustand';
import { RegexHistoryItem, fetchHistory, insertHistory } from '../data/db/sqlite';

interface HistoryState {
  history: RegexHistoryItem[];
  loadHistory: () => Promise<void>;
  addHistory: (pattern: string, input: string, flags: string) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],

  loadHistory: async () => {
    const data = await fetchHistory();
    set({ history: data });
  },

  addHistory: async (pattern, input, flags) => {
    await insertHistory(pattern, input, flags);
    const data = await fetchHistory();
    set({ history: data });
  },
}));
