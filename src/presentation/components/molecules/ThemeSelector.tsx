// Importa React para usar componentes funcionales y JSX
import React from 'react';
// Importa componentes de UI y estilos desde React Native
import { View, TouchableOpacity, StyleSheet, Text, useColorScheme } from 'react-native';
// Importa el observer de MobX para hacer que el componente reaccione a cambios en el estado
import { observer } from 'mobx-react-lite';
// Importa el store del tema y el tipo ThemeMode (puede ser 'light', 'dark' o 'system')
import { themeStore, ThemeMode } from '../../../store/themeStore';

// Define los íconos que representan cada modo de tema
const icons = {
  light: '🌞',   // Modo claro
  dark: '🌙',    // Modo oscuro
  system: '⚙️',  // Modo automático según el sistema
};

// Componente funcional que permite seleccionar el tema de la app
export const ThemeSelector = observer(() => {
  // Modo actual seleccionado por el usuario ('light', 'dark' o 'system')
  const current = themeStore.mode;

  // Modo resuelto según la preferencia del sistema (cuando se usa 'system')
  const resolved = themeStore.resolvedMode;

  // Booleano que indica si el modo resuelto es oscuro
  const isDark = resolved === 'dark';

  // Devuelve el ícono correspondiente al tema activo (resuelto si está en 'system')
  const getActiveIcon = (): ThemeMode => {
    if (current === 'system') return resolved;
    return current;
  };

  return (
    <View style={styles.container}>
      {/* Mapea sobre los tres modos disponibles para renderizar un botón por cada uno */}
      {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
        <TouchableOpacity
          key={mode} // Llave única para cada modo
          onPress={() => themeStore.setMode(mode)} // Cambia el modo en el store al presionar
          style={[
            styles.iconButton, // Estilo base del botón
            current === mode && styles.activeButton, // Si está seleccionado, aplica estilo activo
            // Si el modo es 'system', se colorea según si es 'light' o 'dark' resuelto
            mode === 'system' && current === 'system'
              ? resolved === 'light'
                ? styles.lightSystem
                : styles.darkSystem
              : null,
          ]}
        >
          <Text
            style={[
              styles.icon, // Estilo base del ícono
              current === mode && styles.activeIcon, // Estilo adicional si es el ícono activo
              isDark && { color: '#fff' }, // Fuerza blanco en modo oscuro
            ]}
          >
            {icons[mode]} {/* Muestra el ícono correspondiente al modo */}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

// Estilos utilizados en el componente
const styles = StyleSheet.create({
  // Contenedor que alinea los botones en fila y centrados
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  // Estilo base para cada botón de ícono
  iconButton: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 999, // Botón completamente redondo
    backgroundColor: '#ddd',
  },
  // Estilo aplicado al botón activo (tema seleccionado)
  activeButton: {
    backgroundColor: '#4caf50', // Verde
  },
  // Estilo base del ícono (emoji)
  icon: {
    fontSize: 22,
  },
  // Estilo para el ícono activo (tema seleccionado)
  activeIcon: {
    fontWeight: 'bold',
    color: '#fff',
  },
  // Estilo especial si el modo 'system' está resuelto como 'light'
  lightSystem: {
    backgroundColor: '#ffdd57', // Amarillo
  },
  // Estilo especial si el modo 'system' está resuelto como 'dark'
  darkSystem: {
    backgroundColor: '#666', // Gris oscuro
  },
});
