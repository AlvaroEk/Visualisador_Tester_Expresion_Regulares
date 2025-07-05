import React from 'react';
import { ScrollView, View, StyleSheet, useWindowDimensions } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useRoute } from '@react-navigation/native';
import ASTDiagram from '../../components/organisms/ASTDiagram';
import { themeStore } from '../../../store/themeStore';

const ASTDiagramScreen = observer(() => {
  const route = useRoute();
  const { width } = useWindowDimensions();
  const { nodes, connections } = route.params as {
    nodes: { id: string; label: string; x: number; y: number }[];
    connections: { from: string; to: string }[];
  };

  const maxX = Math.max(...nodes.map(n => n.x)) + 300;
  const maxY = Math.max(...nodes.map(n => n.y)) + 300;

  const isDarkMode = themeStore.resolvedMode === 'dark';

  // ✅ Fondo de pantalla según el modo
  const backgroundColor = isDarkMode ? '#0f172a' : '#d9eaff';

  return (
    <View style={[styles.fullScreen, { backgroundColor }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ minWidth: Math.max(width, maxX) }}
      >
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ minHeight: maxY }}
        >
          <ASTDiagram nodes={nodes} connections={connections} />
        </ScrollView>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
});

export default ASTDiagramScreen;
