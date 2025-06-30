import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { themeStore, ThemeMode } from '../../../store/themeStore';

const MODES: ThemeMode[] = ['light', 'system', 'dark'];

const ThemeToggle = observer(() => {
  const current = themeStore.mode;
  const thumbAnim = useRef(new Animated.Value(0)).current;

  const getIndex = () => MODES.indexOf(current);

  useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: getIndex(),
      duration: 250,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [current]);

  const handlePress = () => {
    const nextIndex = (getIndex() + 1) % MODES.length;
    themeStore.setMode(MODES[nextIndex]);
  };

  const thumbTranslate = thumbAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [4, 50, 90], 
  });

  return (
    <View style={styles.container}>
      <Pressable style={styles.track} onPress={handlePress}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbTranslate }] }]}>
          <Text style={styles.icon}>
            {current === 'light' ? '🌞' : current === 'dark' ? '🌙' : '⚙️'}
          </Text>
        </Animated.View>
        <View style={styles.optionContainer}>
          <Text style={styles.option}>🌞</Text>
          <Text style={styles.option}>⚙️</Text>
          <Text style={styles.option}>🌙</Text>
        </View>
      </Pressable>
    </View>
  );
});

export default ThemeToggle;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  track: {
    width: 128,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  thumb: {
    position: 'absolute',
    top: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    zIndex: 2,
  },
  icon: {
    fontSize: 18,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  option: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
  },
});
