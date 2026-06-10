import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';

interface WordmarkProps {
  /** Display-font size for "Paper" / "Petals"; the & scales with it. */
  size?: number;
}

/** "Paper & Petals" — display serif with the script terracotta ampersand. */
export function Wordmark({ size = 22 }: WordmarkProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.word, { fontSize: size }]}>Paper</Text>
      <Text style={[styles.amp, { fontSize: size * 1.1 }]}>&</Text>
      <Text style={[styles.word, { fontSize: size }]}>Petals</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  word: {
    fontFamily: theme.font.display,
    color: theme.color.fg1,
    letterSpacing: -0.1,
  },
  amp: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    color: theme.palette.terracotta,
  },
});
