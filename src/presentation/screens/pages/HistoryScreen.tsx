import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { themeStore } from '../../../store/themeStore';
import { Colors } from '../../../theme/colors';
import { useHistoryStore } from '../../../store/historyStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RegexHistoryItem } from '../../../data/db/sqlite';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'History'>;

export const HistoryScreen = () => {
  const navigation = useNavigation<Navigation>();
  const history = useHistoryStore(state => state.history);
  const isDark = themeStore.resolvedMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  // Filtrar duplicados por pattern|flags y limitar a 10
  const uniqueHistory = Array.from(
    new Map(history.map(item => [`${item.pattern}|${item.flags}`, item])).values()
  ).slice(0, 10);

  const renderItem = ({ item }: { item: RegexHistoryItem }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('RegexTester', {
          pattern: item.pattern,
          flags: item.flags,
        })
      }
    >
      <View style={[styles.item, { backgroundColor: isDark ? '#444' : '#eee' }]}>
        <View style={styles.row}>
          <Ionicons
            name="code-slash-outline"
            size={20}
            color={theme.text}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.text, { color: theme.text }]}>
            /{item.pattern}/ {item.flags}
          </Text>
        </View>
        <Text style={[styles.timestamp, { color: theme.secondaryText }]}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>
        Historial de Expresiones
      </Text>
      <FlatList
        data={uniqueHistory}
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
    marginBottom: 12,
  },
  list: {
    paddingBottom: 16,
  },
  item: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
});
