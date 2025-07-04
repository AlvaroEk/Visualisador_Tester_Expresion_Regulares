// Importa React para usar JSX y componentes funcionales
import React from 'react';
// Importa componentes de UI y utilidades de estilo desde React Native
import { Text, StyleSheet, View } from 'react-native';
// Importa el observer de MobX para hacer reactivo el componente a cambios del store
import { observer } from 'mobx-react-lite';
// Importa el store que gestiona el modo de tema (oscuro o claro)
import { themeStore } from '../../../store/themeStore';

// Define las propiedades esperadas por el componente
interface Props {
  // Texto que representa un match (coincidencia) de la expresión regular
  match: string;
}

// Componente funcional que muestra un match resaltado, adaptando el estilo según el tema
export const MatchHighlight = observer(({ match }: Props) => {
  // Determina si el modo actual es oscuro
  const isDark = themeStore.resolvedMode === 'dark';

  // Define el color de fondo según el tema
  const backgroundColor = isDark ? '#333' : '#fff9c4'; // fondo oscuro o amarillo claro

  // Define el color del texto según el tema
  const textColor = isDark ? '#ffffff' : '#000000';    // blanco o negro

  // Renderiza una vista contenedora con texto estilizado para mostrar el match
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{match}</Text>
    </View>
  );
});

// Estilos utilizados por el componente
const styles = StyleSheet.create({
  container: {
    // Espaciado interno del contenedor
    padding: 8,

    // Espaciado inferior para separar entre coincidencias
    marginBottom: 6,

    // Bordes redondeados
    borderRadius: 8,
  },
  text: {
    // Tamaño de fuente
    fontSize: 16,

    // Peso de fuente medio
    fontWeight: '500',
  },
});
