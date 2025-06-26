import React from 'react';
import { Text } from 'react-native';

interface Props {
  text: string;
  indices: [number, number][];
}

export const HighlightedText = ({ text, indices }: Props) => {
  if (indices.length === 0) return <Text>{text}</Text>;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  indices.forEach(([start, end], i) => {
    if (start > lastIndex) {
      parts.push(<Text key={`plain-${i}`}>{text.slice(lastIndex, start)}</Text>);
    }

    parts.push(
      <Text
        key={`highlight-${i}`}
        style={{ backgroundColor: '#ffeeaa', color: '#000', fontWeight: 'bold' }}
      >
        {text.slice(start, end)}
      </Text>
    );

    lastIndex = end;
  });

  if (lastIndex < text.length) {
    parts.push(<Text key="end">{text.slice(lastIndex)}</Text>);
  }

  return <Text>{parts}</Text>;
};
