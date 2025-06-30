import React from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useHistoryStore } from '../../../store/historyStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { themeStore } from '../../../store/themeStore';
import { Colors } from '../../../theme/colors';

export const HistoryScreen = () => {
  const history = useHistoryStore(state => state.history);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isDark = themeStore.resolvedMode === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>
        Historial de Expresiones
      </Text>

      <FlatList
        data={history}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('RegexTester', {
                pattern: item.pattern,
                flags: item.flags,
              });
            }}
          >
            <View style={[styles.item, { backgroundColor: isDark ? '#444' : '#eee' }]}>
              <Text style={[styles.text, { color: theme.text }]}>
                /{item.pattern}/ {item.flags}
              </Text>
              <Text style={[styles.timestamp, { color: theme.secondaryText }]}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  item: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
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
