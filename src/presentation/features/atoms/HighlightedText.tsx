import React from 'react';
import { Text } from 'react-native';

interface Props {
  text: string;
  indices: [number, number][];
  textColor?: string; 
}

export const HighlightedText: React.FC<Props> = ({ text, indices, textColor = '#000' }) => {
  if (!indices || indices.length === 0) {
    return <Text style={{ color: textColor }}>{text}</Text>;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  indices.forEach(([start, end], i) => {
    if (lastIndex < start) {
      parts.push(
        <Text key={`normal-${i}`} style={{ color: textColor }}>
          {text.slice(lastIndex, start)}
        </Text>
      );
    }

    parts.push(
      <Text
        key={`highlight-${i}`}
        style={{
          backgroundColor: '#ffeeaa',
          color: '#000', // Coincidencia resaltada
          fontWeight: 'bold',
        }}
      >
        {text.slice(start, end)}
      </Text>
    );

    lastIndex = end;
  });

  if (lastIndex < text.length) {
    parts.push(
      <Text key="last" style={{ color: textColor }}>
        {text.slice(lastIndex)}
      </Text>
    );
  }

  return <Text>{parts}</Text>;
};
