// Importa React y hooks necesarios para el componente
import React, { useEffect, useRef } from 'react';
// Importa componentes visuales y utilidades de estilo y animación desde React Native
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
// Importa observer de MobX para hacer reactivo el componente
import { observer } from 'mobx-react-lite';
// Importa el store del tema y el tipo ThemeMode
import { themeStore, ThemeMode } from '../../../store/themeStore';

// Arreglo con los modos de tema disponibles, en orden
const MODES: ThemeMode[] = ['light', 'system', 'dark'];

// Componente funcional que permite alternar entre temas con una animación tipo "switch"
const ThemeToggle = observer(() => {
  // Obtiene el modo actual del store
  const current = themeStore.mode;

  // Crea una referencia animada para el movimiento del thumb
  const thumbAnim = useRef(new Animated.Value(0)).current;

  // Devuelve el índice del modo actual dentro del arreglo MODES
  const getIndex = () => MODES.indexOf(current);

  // Efecto que se ejecuta cada vez que cambia el modo y anima el thumb a la nueva posición
  useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: getIndex(), // Nueva posición del thumb
      duration: 250,       // Duración de la animación
      useNativeDriver: false,
      easing: Easing.out(Easing.ease), // Suaviza el movimiento
    }).start();
  }, [current]);

  // Maneja el evento de presionar el switch: cambia al siguiente modo de tema
  const handlePress = () => {
    const nextIndex = (getIndex() + 1) % MODES.length;
    themeStore.setMode(MODES[nextIndex]);
  };

  // Define cómo debe desplazarse el thumb según el valor animado
  const thumbTranslate = thumbAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [4, 50, 90], // Posiciones en píxeles del thumb para cada modo
  });

  return (
    <View style={styles.container}>
      {/* Zona interactiva del switch */}
      <Pressable style={styles.track} onPress={handlePress}>
        {/* Círculo animado (thumb) que se mueve según el modo actual */}
        <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbTranslate }] }]}>
          <Text style={styles.icon}>
            {/* Ícono dentro del thumb, cambia según el modo */}
            {current === 'light' ? '🌞' : current === 'dark' ? '🌙' : '⚙️'}
          </Text>
        </Animated.View>

        {/* Íconos de cada opción debajo del thumb */}
        <View style={styles.optionContainer}>
          <Text style={styles.option}>🌞</Text>
          <Text style={styles.option}>⚙️</Text>
          <Text style={styles.option}>🌙</Text>
        </View>
      </Pressable>
    </View>
  );
});

// Exporta el componente como default
export default ThemeToggle;

// Estilos utilizados por el componente
const styles = StyleSheet.create({
  // Contenedor principal del switch
  container: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  // Fondo del switch (pista)
  track: {
    width: 128,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  // Estilo del thumb (círculo deslizante)
  thumb: {
    position: 'absolute',
    top: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    zIndex: 2,
  },
  // Ícono dentro del thumb
  icon: {
    fontSize: 18,
  },
  // Contenedor de los íconos de opción
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  // Estilo de cada ícono de opción (fijo, debajo del thumb)
  option: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
});
