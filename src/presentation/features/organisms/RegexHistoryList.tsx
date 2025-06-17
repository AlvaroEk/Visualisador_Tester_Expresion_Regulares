import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RegexHistoryService, RegexHistoryItem } from '../../../services/regexHistoryService';

interface Props {
  onSelect: (item: RegexHistoryItem) => void;
}

export const RegexHistoryList = ({ onSelect }: Props) => {
  const [history, setHistory] = useState<RegexHistoryItem[]>([]);

  useEffect(() => {
    RegexHistoryService.getHistory().then(setHistory);
  }, []);

  return (
    <View>
      <Text style={{ fontWeight: 'bold', marginVertical: 8 }}>Historial Reciente:</Text>
      {history.map((item, i) => (
        <TouchableOpacity key={i} onPress={() => onSelect(item)}>
          <Text>
            /{item.pattern}/{item.flags}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
