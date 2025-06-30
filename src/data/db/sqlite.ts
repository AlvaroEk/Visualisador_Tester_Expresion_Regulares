import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('regex_history.db');

export interface RegexHistoryItem {
  id: number;
  pattern: string;
  input: string;
  flags: string;
  timestamp: string;
}

// Inicializa la base de datos
export const initDB = (): void => {
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pattern TEXT,
      input TEXT,
      flags TEXT,
      timestamp TEXT
    );
  `).catch(console.warn);
};

// Inserta si no existe duplicado exacto
export const insertHistory = async (
  pattern: string,
  input: string,
  flags: string
): Promise<void> => {
  const existing = await db.getFirstAsync<RegexHistoryItem>(
    'SELECT * FROM history WHERE pattern = ? AND input = ? AND flags = ?',
    pattern,
    input,
    flags
  );

  if (!existing) {
    const timestamp = new Date().toISOString();
    await db.runAsync(
      'INSERT INTO history (pattern, input, flags, timestamp) VALUES (?, ?, ?, ?)',
      pattern,
      input,
      flags,
      timestamp
    );
  }
};

// Obtiene el historial ordenado
export const fetchHistory = async (): Promise<RegexHistoryItem[]> => {
  return await db.getAllAsync<RegexHistoryItem>(
    'SELECT * FROM history ORDER BY timestamp DESC'
  );
};

// Elimina una entrada por ID
export const deleteHistoryItem = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM history WHERE id = ?', id);
};

// 🧹 Elimina todo el historial
export const deleteAllHistory = async (): Promise<void> => {
  await db.runAsync('DELETE FROM history');
};
