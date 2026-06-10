import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  /** Dashed hand-stitch border — for hero brand surfaces only. */
  stitched?: boolean;
  style?: ViewStyle;
}

/** Warm cream paper card: hairline border, soft layered shadow, 16px radius. */
export function Card({ children, stitched = false, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {stitched && <View style={styles.stitch} pointerEvents="none" />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    borderWidth: theme.border.hair,
    borderColor: theme.palette.hairline,
    padding: theme.space[6],
    ...theme.shadow.card,
  },
  stitch: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.palette.stitch,
    borderRadius: theme.radius.md,
  },
});
