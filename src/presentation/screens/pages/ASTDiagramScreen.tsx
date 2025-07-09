import React from 'react';
// Importa componentes de interfaz desde React Native
import { ScrollView, View, StyleSheet, useWindowDimensions } from 'react-native';
// Habilita observación reactiva usando MobX
import { observer } from 'mobx-react-lite';
// Hook para acceder a los parámetros de navegación
import { useRoute } from '@react-navigation/native';
// Componente que renderiza el diagrama AST con SVG
import ASTDiagram from '../../components/organisms/ASTDiagram';
// Store que contiene la preferencia de tema (claro/oscuro)
import { themeStore } from '../../../store/themeStore';

// Componente funcional de pantalla que muestra el diagrama del AST
const ASTDiagramScreen = observer(() => {
  // Obtiene parámetros enviados por navegación (nodos y conexiones)
  const route = useRoute();
  // Obtiene el ancho de la ventana actual (útil para scroll horizontal mínimo)
  const { width } = useWindowDimensions();

  // Extrae los datos de nodos y conexiones del AST enviados como parámetro
  const { nodes, connections } = route.params as {
    nodes: { id: string; label: string; x: number; y: number }[]; // Nodos del AST con coordenadas
    connections: { from: string; to: string }[];                  // Conexiones entre nodos
  };

  // Determina el ancho y alto total del canvas basado en los nodos más lejanos
  const maxX = Math.max(...nodes.map(n => n.x)) + 300; // Agrega margen derecho
  const maxY = Math.max(...nodes.map(n => n.y)) + 300; // Agrega margen inferior

  // Verifica si el tema actual es oscuro
  const isDarkMode = themeStore.resolvedMode === 'dark';

  // Define el color de fondo según el tema activo
  const backgroundColor = isDarkMode ? '#0f172a' : '#d9eaff';

  return (
    // Contenedor principal con fondo adaptado al tema
    <View style={[styles.fullScreen, { backgroundColor }]}>
      {/* Scroll horizontal que contiene el scroll vertical, creando un canvas navegable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ minWidth: Math.max(width, maxX) }}
      >
        {/* Scroll vertical anidado, necesario para recorrer nodos hacia abajo */}
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ minHeight: maxY }}
        >
          {/* Componente que dibuja el diagrama completo con nodos y conexiones */}
          <ASTDiagram nodes={nodes} connections={connections} />
        </ScrollView>
      </ScrollView>
    </View>
  );
});

// Estilos aplicados al contenedor principal
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1, // Ocupa todo el espacio disponible
  },
});

export default ASTDiagramScreen;
