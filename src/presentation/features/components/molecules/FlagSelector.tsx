import React from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  selectedFlags: string;
  onChange: (flags: string) => void;
  invalidFlags?: string[];
  dark?: boolean;
}

const FLAGS = ['g', 'i', 'm', 's', 'u', 'y'];

export const FlagSelector = ({ selectedFlags, onChange, invalidFlags = [], dark = false }: Props) => {
  const toggleFlag = (flag: string) => {
    const index = selectedFlags.indexOf(flag);
    const updated =
      index === -1
        ? selectedFlags + flag
        : selectedFlags.slice(0, index) + selectedFlags.slice(index + 1);
    onChange(updated);
  };

  return (
    <View style={styles.container}>
      {FLAGS.map((flag) => {
        const selected = selectedFlags.includes(flag);
        const invalid = invalidFlags.includes(flag);

        const scale = useSharedValue(1);
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: withTiming(scale.value, { duration: 200 }) }],
        }));

        const onPress = () => {
          scale.value = 1.2;
          toggleFlag(flag);
          setTimeout(() => (scale.value = 1), 200);
        };

        const backgroundColor = selected
          ? dark
            ? '#2196f3'
            : '#007bff'
          : dark
          ? '#444'
          : '#eee';

        const color = selected
          ? '#fff'
          : dark
          ? '#ccc'
          : '#000';

        return (
          <TouchableWithoutFeedback key={flag} onPress={onPress}>
            <Animated.View
              style={[
                styles.flag,
                { backgroundColor, borderColor: invalid ? 'red' : 'transparent' },
                animatedStyle,
              ]}
            >
              <Text style={[styles.flagText, { color }]}>{flag}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  flag: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  flagText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
