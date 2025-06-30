import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { themeStore } from '../../../store/themeStore';
import { Colors } from '../../../theme/colors';
import {
  fetchHistory,
  deleteHistoryItem,
  deleteAllHistory,
  RegexHistoryItem,
} from '../../../data/db/sqlite';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'History'>;

export const HistoryScreen = () => {
  const navigation = useNavigation<Navigation>();
  const [history, setHistory] = useState<RegexHistoryItem[]>([]);
  const isDark = themeStore.resolvedMode === 'dark';
  const isFocused = useIsFocused();
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    loadHistory();
  }, [isFocused]);

  const loadHistory = async () => {
    const all = await fetchHistory();
    const unique = Array.from(
      new Map(all.map((item) => [`${item.pattern}|${item.flags}`, item])).values()
    );
    setHistory(unique.slice(0, 10));
  };

  const handleDelete = (id: number) => {
    Alert.alert('Eliminar', '¿Deseas eliminar esta expresión del historial?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteHistoryItem(id);
          loadHistory();
        },
      },
    ]);
  };

  const handleDeleteAll = () => {
    Alert.alert('Eliminar Todo', '¿Eliminar todo el historial de expresiones?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar Todo',
        style: 'destructive',
        onPress: async () => {
          await deleteAllHistory();
          loadHistory();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: RegexHistoryItem }) => (
    <View style={[styles.item, { backgroundColor: theme.surface }]}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('RegexTester', {
            pattern: item.pattern,
            flags: item.flags,
          })
        }
        style={styles.textArea}
      >
        <Text style={[styles.text, { color: theme.text }]}>
          /{item.pattern}/ {item.flags}
        </Text>
        <Text style={[styles.timestamp, { color: theme.secondaryText }]}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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

      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

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
