import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'regex_history';

export interface RegexHistoryItem {
  pattern: string;
  flags: string;
  timestamp: number;
}

export const RegexHistoryService = {
  async saveExpression(pattern: string, flags: string): Promise<void> {
    const existing = await RegexHistoryService.getHistory();
    const newItem: RegexHistoryItem = {
      pattern,
      flags,
      timestamp: Date.now(),
    };

    const updated = [newItem, ...existing.filter(item => item.pattern !== pattern)];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated.slice(0, 20))); // máx 20
  },

  async getHistory(): Promise<RegexHistoryItem[]> {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async clearHistory(): Promise<void> {
    await AsyncStorage.removeItem(HISTORY_KEY);
  },
};
