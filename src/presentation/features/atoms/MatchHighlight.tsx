import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  match: string;
}

export const MatchHighlight = ({ match }: Props) => (
  <Text style={styles.highlight}>{match}</Text>
);

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: '#ffeeaa',
    padding: 2,
    borderRadius: 4,
  },
});
