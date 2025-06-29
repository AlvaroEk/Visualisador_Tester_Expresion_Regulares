import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, useColorScheme } from 'react-native';
import { observer } from 'mobx-react-lite';
import { themeStore, ThemeMode } from '../../../store/themeStore';

const icons = {
  light: '🌞',
  dark: '🌙',
  system: '⚙️',
};

export const ThemeSelector = observer(() => {
  const current = themeStore.mode;
  const resolved = themeStore.resolvedMode;
  const isDark = resolved === 'dark';

  const getActiveIcon = (): ThemeMode => {
    if (current === 'system') return resolved;
    return current;
  };

  return (
    <View style={styles.container}>
      {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
        <TouchableOpacity
          key={mode}
          onPress={() => themeStore.setMode(mode)}
          style={[
            styles.iconButton,
            current === mode && styles.activeButton,
            mode === 'system' && current === 'system'
              ? resolved === 'light'
                ? styles.lightSystem
                : styles.darkSystem
              : null,
          ]}
        >
          <Text
            style={[
              styles.icon,
              current === mode && styles.activeIcon,
              isDark && { color: '#fff' },
            ]}
          >
            {icons[mode]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  iconButton: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 999,
    backgroundColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#4caf50',
  },
  icon: {
    fontSize: 22,
  },
  activeIcon: {
    fontWeight: 'bold',
    color: '#fff',
  },
  lightSystem: {
    backgroundColor: '#ffdd57',
  },
  darkSystem: {
    backgroundColor: '#666',
  },
});
