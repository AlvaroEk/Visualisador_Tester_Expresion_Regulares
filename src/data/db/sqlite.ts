import { openDatabaseSync } from 'expo-sqlite'; // Importa la función para abrir una base de datos SQLite de forma sincrónica usando Expo

const db = openDatabaseSync('regex_history.db'); // Abre (o crea si no existe) una base de datos llamada 'regex_history.db'

export interface RegexHistoryItem {
  id: number;        // ID único de la entrada
  pattern: string;   // Expresión regular utilizada
  input: string;     // Texto de entrada sobre el cual se aplicó la regex
  flags: string;     // Banderas utilizadas en la expresión regular
  timestamp: string; // Marca de tiempo de cuándo se guardó
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
  `).catch(console.warn); // Muestra advertencia en consola si ocurre un error
};

// Inserta si no existe duplicado exacto
export const insertHistory = async (
  pattern: string,
  input: string,
  flags: string
): Promise<void> => {
  // Busca si ya existe una entrada con el mismo pattern, input y flags
  const existing = await db.getFirstAsync<RegexHistoryItem>(
    'SELECT * FROM history WHERE pattern = ? AND input = ? AND flags = ?',
    pattern,
    input,
    flags
  );

  if (!existing) {
    const timestamp = new Date().toISOString(); // Obtiene la fecha y hora actual en formato ISO
    await db.runAsync(
      'INSERT INTO history (pattern, input, flags, timestamp) VALUES (?, ?, ?, ?)',
      pattern,
      input,
      flags,
      timestamp
    ); // Inserta la nueva entrada en la tabla
  }
};

// Obtiene el historial ordenado
export const fetchHistory = async (): Promise<RegexHistoryItem[]> => {
  return await db.getAllAsync<RegexHistoryItem>(
    'SELECT * FROM history ORDER BY timestamp DESC' // Obtiene todas las entradas ordenadas por fecha descendente (más reciente primero)
  );
};

// Elimina una entrada por ID
export const deleteHistoryItem = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM history WHERE id = ?', id); // Elimina una entrada según su ID
};

// Elimina todo el historial
export const deleteAllHistory = async (): Promise<void> => {
  await db.runAsync('DELETE FROM history'); // Borra todos los registros de la tabla
};
