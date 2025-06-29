import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { themeStore } from '../../../store/themeStore';

interface Props {
  match: string;
}

export const MatchHighlight = observer(({ match }: Props) => {
  const isDark = themeStore.resolvedMode === 'dark';

  const backgroundColor = isDark ? '#333' : '#fff9c4'; // fondo oscuro o amarillo claro
  const textColor = isDark ? '#ffffff' : '#000000';    // blanco o negro

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{match}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginBottom: 6,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});
