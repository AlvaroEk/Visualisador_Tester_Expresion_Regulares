import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  fetchHistory,
  deleteHistoryItem,
  RegexHistoryItem,
} from '../../../data/db/sqlite';
import { useIsFocused } from '@react-navigation/native';
import { themeStore } from '../../../store/themeStore';
import { Colors } from '../../../theme/colors';

interface Props {
  onSelect?: (item: { pattern: string; flags: string }) => void;
}

export const RegexHistoryList = ({ onSelect }: Props) => {
  const [history, setHistory] = useState<RegexHistoryItem[]>([]);
  const isFocused = useIsFocused();
  const isDark = themeStore.resolvedMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    loadHistory();
  }, [isFocused]);

  const loadHistory = async () => {
    const all = await fetchHistory();
    setHistory(all.slice(0, 10)); // Mostrar solo las 10 últimas
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

  const renderItem = ({ item }: { item: RegexHistoryItem }) => (
    <View style={[styles.item, { backgroundColor: theme.surface }]}>
      <TouchableOpacity
        style={styles.textArea}
        onPress={() =>
          onSelect?.({ pattern: item.pattern, flags: item.flags })
        }
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
    <FlatList
      data={history}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  textArea: {
    flex: 1,
    paddingRight: 12,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
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
});
