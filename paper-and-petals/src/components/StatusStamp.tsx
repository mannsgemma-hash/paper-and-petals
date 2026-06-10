import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';

type Tone = 'sage' | 'cream' | 'gold' | 'terracotta';

const TONES: Record<Tone, { bg: string; fg: string; border: string }> = {
  sage: { bg: 'rgba(78,102,82,0.10)', fg: theme.palette.forest, border: 'rgba(78,102,82,0.30)' },
  cream: { bg: 'rgba(75,64,56,0.06)', fg: theme.color.fg2, border: theme.palette.hairline },
  gold: { bg: 'rgba(168,137,63,0.14)', fg: '#7E6322', border: 'rgba(168,137,63,0.45)' },
  terracotta: { bg: 'rgba(196,123,99,0.12)', fg: theme.palette.terracotta, border: 'rgba(196,123,99,0.35)' },
};

interface StatusStampProps {
  tone?: Tone;
  children: React.ReactNode;
}

/** Vintage stamp-style status badge — membership status, account state. */
export function StatusStamp({ tone = 'sage', children }: StatusStampProps) {
  const t = TONES[tone];
  return (
    <View style={[styles.stamp, { backgroundColor: t.bg, borderColor: t.border }]}>
      <Text style={[styles.text, { color: t.fg }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stamp: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
  },
  text: {
    fontFamily: theme.font.ui,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
