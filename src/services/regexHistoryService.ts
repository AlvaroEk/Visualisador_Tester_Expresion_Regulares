// Importa el módulo AsyncStorage para almacenamiento local en React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave utilizada para guardar y recuperar el historial
const HISTORY_KEY = 'regex_history';

// Interfaz que define la estructura de un ítem del historial de expresiones regulares
export interface RegexHistoryItem {
  pattern: string;     // Patrón de la expresión regular
  flags: string;       // Banderas utilizadas (g, i, m, etc.)
  timestamp: number;   // Marca de tiempo de cuándo fue guardado
}

// Servicio que maneja el historial de expresiones regulares usando AsyncStorage
export const RegexHistoryService = {
  // Guarda una nueva expresión regular en el historial
  async saveExpression(pattern: string, flags: string): Promise<void> {
    // Obtiene el historial actual
    const existing = await RegexHistoryService.getHistory();

    // Crea un nuevo ítem con patrón, flags y timestamp
    const newItem: RegexHistoryItem = {
      pattern,
      flags,
      timestamp: Date.now(),
    };

    // Inserta el nuevo ítem al principio, eliminando duplicados por patrón
    const updated = [newItem, ...existing.filter(item => item.pattern !== pattern)];

    // Guarda los primeros 20 elementos en AsyncStorage
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated.slice(0, 20)));
  },

  // Recupera el historial desde AsyncStorage
  async getHistory(): Promise<RegexHistoryItem[]> {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : []; // Parsea o devuelve lista vacía
  },

  // Elimina todo el historial
  async clearHistory(): Promise<void> {
    await AsyncStorage.removeItem(HISTORY_KEY);
  },
};
