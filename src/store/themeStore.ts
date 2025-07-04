// Importa `makeAutoObservable` de MobX para hacer la clase observable automáticamente
import { makeAutoObservable } from 'mobx';
// Importa `Appearance` para detectar el modo de color del sistema (claro u oscuro)
import { Appearance } from 'react-native';

// Define el tipo `ThemeMode` que puede ser 'light', 'dark' o 'system'
export type ThemeMode = 'light' | 'dark' | 'system';

// Define la clase `ThemeStore` que maneja el modo de tema de la app
export class ThemeStore {
  // Modo actual del tema, por defecto sigue el sistema
  mode: ThemeMode = 'system';

  // Constructor: hace que todas las propiedades y métodos sean observables automáticamente
  constructor() {
    makeAutoObservable(this);
  }

  // Método para establecer manualmente el modo de tema
  setMode(mode: ThemeMode) {
    this.mode = mode;
  }

  // Getter computado que resuelve el modo actual: si es 'system', lo obtiene del sistema
  get resolvedMode(): 'light' | 'dark' {
    if (this.mode === 'system') {
      const colorScheme = Appearance.getColorScheme(); // Obtiene 'light' o 'dark' del sistema
      return colorScheme === 'dark' ? 'dark' : 'light'; // Devuelve 'dark' si es oscuro, si no 'light'
    }
    return this.mode; // Si no es 'system', devuelve el valor elegido por el usuario
  }
}

// Exporta una instancia única (singleton) del store
export const themeStore = new ThemeStore();
