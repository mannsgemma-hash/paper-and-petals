import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { theme } from '../theme/theme';

interface EyebrowProps {
  children: React.ReactNode;
  color?: string;
  style?: TextStyle;
}

/** Uppercase micro-label with wide letter-spacing — section eyebrows and tags. */
export function Eyebrow({ children, color, style }: EyebrowProps) {
  return (
    <Text style={[styles.eyebrow, color ? { color } : null, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.micro,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: theme.color.fg3,
    fontWeight: '600',
  },
});
