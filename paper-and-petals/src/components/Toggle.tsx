import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface ToggleProps {
  on: boolean;
  onChange?: (on: boolean) => void;
}

/** Brand toggle — forest green when on, knob slides with paper-settle ease. */
export function Toggle({ on, onChange }: ToggleProps) {
  const anim = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: on ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [on, anim]);

  const left = anim.interpolate({ inputRange: [0, 1], outputRange: [3, 21] });
  const bg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(75,64,56,0.18)', theme.palette.forest],
  });

  return (
    <Pressable
      onPress={() => onChange?.(!on)}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      hitSlop={10}
    >
      <Animated.View style={[styles.track, { backgroundColor: bg }]}>
        <Animated.View style={[styles.knob, { left }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: theme.radius.pill,
    justifyContent: 'center',
  },
  knob: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.color.surface,
    shadowColor: theme.palette.espresso,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
