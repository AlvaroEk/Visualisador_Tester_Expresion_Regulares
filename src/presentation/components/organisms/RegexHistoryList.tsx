import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { RegexHistoryService } from '../../../services/regexHistoryService';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../../../store/themeStore';
import { Colors } from '../../../theme/colors';

interface Props {
  onSelect: (item: { pattern: string; flags: string }) => void;
}

interface RegexHistoryItem {
  pattern: string;
  flags: string;
}

export const RegexHistoryList = observer(({ onSelect }: Props) => {
  const [history, setHistory] = useState<RegexHistoryItem[]>([]);
  const isDark = themeStore.resolvedMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    const load = async () => {
      const data = await RegexHistoryService.getHistory();
      setHistory(data);
    };
    load();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Historial Reciente:</Text>

      {history.length === 0 && (
        <Text style={{ color: theme.secondaryText, marginTop: 4 }}>Sin historial.</Text>
      )}

      {history.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelect(item)}
          style={[styles.item, { borderColor: theme.border }]}
        >
          <Text style={[styles.text, { color: theme.text }]}>
            /{item.pattern}/{item.flags}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    padding: 8,
    borderRadius: 8,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 15,
  },
  item: {
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 14,
  },
});
