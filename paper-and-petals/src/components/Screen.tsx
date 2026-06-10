import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';

const parchment = require('../../assets/brand/loading_background.png');

interface ScreenProps {
  children: React.ReactNode;
  /** Render the parchment paper texture behind content (most screens do). */
  texture?: boolean;
  style?: ViewStyle;
}

/**
 * Base screen surface: warm-white background with the brand parchment
 * texture and a soft cream wash, wrapped in safe-area insets.
 */
export function Screen({ children, texture = true, style }: ScreenProps) {
  if (!texture) {
    return (
      <SafeAreaView style={[styles.root, style]}>{children}</SafeAreaView>
    );
  }
  return (
    <View style={styles.root}>
      <ImageBackground source={parchment} resizeMode="cover" style={styles.fill}>
        <View style={styles.wash} />
        <SafeAreaView style={[styles.fill, style]}>{children}</SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.color.bg1 },
  fill: { flex: 1 },
  wash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,253,246,0.45)',
  },
});
