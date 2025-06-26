import { makeAutoObservable } from 'mobx';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export class ThemeStore {
  mode: ThemeMode = 'system';

  constructor() {
    makeAutoObservable(this);
  }

  setMode(mode: ThemeMode) {
    this.mode = mode;
  }

  get resolvedMode(): 'light' | 'dark' {
    if (this.mode === 'system') {
      const colorScheme = Appearance.getColorScheme();
      return colorScheme === 'dark' ? 'dark' : 'light';
    }
    return this.mode;
  }
}

export const themeStore = new ThemeStore();
