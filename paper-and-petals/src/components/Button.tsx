import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  pill?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Brand button. Press feels like pressing down on paper: 96% scale,
 * fast in / settle out.
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  pill = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.timing(scale, {
      toValue: 0.96,
      duration: 80,
      useNativeDriver: true,
    }).start();
  const pressOut = () =>
    Animated.timing(scale, {
      toValue: 1,
      duration: theme.motion.durFast,
      useNativeDriver: true,
    }).start();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : pressIn}
      onPressOut={disabled ? undefined : pressOut}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.base,
          styles[variant],
          pill && styles.pill,
          disabled && styles.disabled,
          { transform: [{ scale }] },
          style,
        ]}
      >
        <Text style={[styles.text, textStyles[variant], textStyle]}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: theme.space[6],
    paddingVertical: theme.space[3],
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: { borderRadius: theme.radius.pill },
  primary: {
    backgroundColor: theme.color.accent,
    ...theme.shadow.paper,
  },
  secondary: {
    backgroundColor: theme.color.surface,
    borderWidth: theme.border.card,
    borderColor: theme.palette.hairline,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: theme.border.card,
    borderColor: theme.palette.danger,
  },
  disabled: { opacity: 0.55 },
  text: {
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.body,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

const textStyles: Record<Variant, TextStyle> = {
  primary: { color: theme.palette.cream },
  secondary: { color: theme.color.fg1 },
  ghost: { color: theme.color.fg2 },
  danger: { color: theme.palette.danger },
};
