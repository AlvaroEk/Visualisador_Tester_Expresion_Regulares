import React from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useHistoryStore } from '../../../store/historyStore';

interface Props {
  onSelect: (item: { pattern: string; flags: string }) => void;
}

export const RegexHistoryList: React.FC<Props> = ({ onSelect }) => {
  const history = useHistoryStore(state => state.history);

  return (
    <View style={styles.container}>
      <FlatList
        nestedScrollEnabled 
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect({ pattern: item.pattern, flags: item.flags })}>
            <View style={styles.item}>
              <Text style={styles.text}>/{item.pattern}/ {item.flags}</Text>
              <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  item: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
});
