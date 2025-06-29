import React from 'react';
import { Text } from 'react-native';
import { themeStore } from '../../store/themeStore';

interface Props {
  text: string;
  indices: [number, number][];
  textColor?: string;
}

export const HighlightedText: React.FC<Props> = ({ text, indices, textColor }) => {
  const isDark = themeStore.resolvedMode === 'dark';
  const baseTextColor = textColor ?? (isDark ? '#fff' : '#000');
  const highlightBg = '#feeb9b'; // Amarillo claro
  const highlightTextColor = '#000'; // Siempre legible sobre amarillo

  if (!indices || indices.length === 0) {
    return <Text style={{ color: baseTextColor }}>{text}</Text>;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  indices.forEach(([start, end], i) => {
    if (lastIndex < start) {
      parts.push(
        <Text key={`normal-${i}`} style={{ color: baseTextColor }}>
          {text.slice(lastIndex, start)}
        </Text>
      );
    }

    parts.push(
      <Text
        key={`highlight-${i}`}
        style={{
          backgroundColor: highlightBg,
          color: highlightTextColor,
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
      <Text key="last" style={{ color: baseTextColor }}>
        {text.slice(lastIndex)}
      </Text>
    );
  }

  return <Text>{parts}</Text>;
};
