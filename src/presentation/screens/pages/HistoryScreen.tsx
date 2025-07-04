// Importa React y los hooks necesarios
import React, { useEffect, useState } from 'react';
// Importa componentes visuales desde React Native
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
// Importa hooks de navegación y control de foco de pantalla
import { useNavigation, useIsFocused } from '@react-navigation/native';
// Importa el store del tema para saber si está en modo oscuro o claro
import { themeStore } from '../../../store/themeStore';
// Importa colores definidos por tema
import { Colors } from '../../../theme/colors';
// Importa funciones para trabajar con el historial y su tipo
import {
  fetchHistory,
  deleteHistoryItem,
  deleteAllHistory,
  RegexHistoryItem,
} from '../../../data/db/sqlite';
// Importa tipo de navegación para la pantalla
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Importa los parámetros del stack para tipar correctamente la navegación
import { RootStackParamList } from '../../../navigation/AppNavigator';

// Define el tipo de navegación de esta pantalla
type Navigation = NativeStackNavigationProp<RootStackParamList, 'History'>;

// Componente funcional que representa la pantalla de historial
export const HistoryScreen = () => {
  const navigation = useNavigation<Navigation>(); // Hook para navegar
  const [history, setHistory] = useState<RegexHistoryItem[]>([]); // Estado local con el historial
  const isDark = themeStore.resolvedMode === 'dark'; // Detecta si es tema oscuro
  const isFocused = useIsFocused(); // Detecta si la pantalla está enfocada
  const theme = isDark ? Colors.dark : Colors.light; // Selecciona el tema activo

  // Al enfocar la pantalla, carga el historial
  useEffect(() => {
    loadHistory();
  }, [isFocused]);

  // Función para cargar el historial desde SQLite
  const loadHistory = async () => {
    const all = await fetchHistory();
    // Elimina duplicados combinando patrón y flags como clave
    const unique = Array.from(
      new Map(all.map((item) => [`${item.pattern}|${item.flags}`, item])).values()
    );
    // Guarda solo los 10 más recientes
    setHistory(unique.slice(0, 10));
  };

  // Muestra confirmación y elimina un ítem si se acepta
  const handleDelete = (id: number) => {
    Alert.alert('Eliminar', '¿Deseas eliminar esta expresión del historial?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteHistoryItem(id);
          loadHistory(); // Recarga la lista actualizada
        },
      },
    ]);
  };

  // Muestra confirmación y elimina todo el historial si se acepta
  const handleDeleteAll = () => {
    Alert.alert('Eliminar Todo', '¿Eliminar todo el historial de expresiones?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar Todo',
        style: 'destructive',
        onPress: async () => {
          await deleteAllHistory();
          loadHistory(); // Recarga lista vacía
        },
      },
    ]);
  };

  // Renderiza cada ítem del historial en la lista
  const renderItem = ({ item }: { item: RegexHistoryItem }) => (
    <View style={[styles.item, { backgroundColor: theme.surface }]}>
      {/* Navega a RegexTester con los datos del historial */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('RegexTester', {
            pattern: item.pattern,
            flags: item.flags,
          })
        }
        style={styles.textArea}
      >
        {/* Muestra la expresión regular */}
        <Text style={[styles.text, { color: theme.text }]}>
          /{item.pattern}/ {item.flags}
        </Text>
        {/* Muestra la fecha de uso */}
        <Text style={[styles.timestamp, { color: theme.secondaryText }]}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </TouchableOpacity>

      {/* Botón para eliminar el ítem individual */}
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  // Renderizado principal de la pantalla
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Encabezado con título y botón de borrar todo */}
      <View style={styles.headerRow}>
        <Text style={[styles.heading, { color: theme.text }]}>
          Historial de Expresiones
        </Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleDeleteAll}>
            <Text style={[styles.clearAll, { color: 'red' }]}> Borrar Todo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de expresiones del historial */}
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

// Estilos utilizados en la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  list: {
    paddingBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  textArea: {
    flex: 1,
    paddingRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 20,
  },
  clearAll: {
    fontSize: 14,
    fontWeight: '600',
  },
});
