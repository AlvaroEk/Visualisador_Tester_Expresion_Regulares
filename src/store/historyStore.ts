// Importa la función `create` desde Zustand para crear un store de estado global
import { create } from 'zustand';
// Importa el tipo RegexHistoryItem y funciones para acceder a la base de datos SQLite
import { RegexHistoryItem, fetchHistory, insertHistory } from '../data/db/sqlite';

// Define la estructura del estado para el store de historial
interface HistoryState {
  history: RegexHistoryItem[];                             // Lista de ítems del historial
  loadHistory: () => Promise<void>;                        // Función para cargar historial desde SQLite
  addHistory: (pattern: string, input: string, flags: string) => Promise<void>; // Agrega un ítem
}

// Crea el store `useHistoryStore` usando Zustand con el estado y funciones definidas
export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [], // Estado inicial: historial vacío

  // Carga el historial desde la base de datos y lo guarda en el estado
  loadHistory: async () => {
    const data = await fetchHistory(); // Obtiene historial desde SQLite
    set({ history: data });            // Actualiza el estado con los datos cargados
  },

  // Inserta una nueva entrada y actualiza el historial
  addHistory: async (pattern, input, flags) => {
    await insertHistory(pattern, input, flags); // Guarda en SQLite
    const data = await fetchHistory();          // Recarga el historial actualizado
    set({ history: data });                     // Actualiza el estado
  },
}));
