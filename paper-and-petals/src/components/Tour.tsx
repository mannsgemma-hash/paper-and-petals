import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme/theme';

// A tiny step-by-step feature tour: dims the screen, draws a soft pulsing
// highlight around one feature at a time, and shows a card explaining it.
// Purely presentational — pass absolute-positioned styles for the ring/card
// per step (the surrounding screen knows where its features live).

export interface TourStep {
  icon?: React.ComponentProps<typeof Feather>['name'];
  title: string;
  body: string;
  /** Absolute position for the explaining card. */
  card: StyleProp<ViewStyle>;
  /** Optional absolute position/size for the highlight ring. */
  ring?: StyleProp<ViewStyle>;
}

export function Tour({ steps, onDone }: { steps: TourStep[]; onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const pulse = useRef(new Animated.Value(0)).current;
  const step = steps[idx];
  const last = idx === steps.length - 1;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  if (!step) return null;

  const next = () => (last ? onDone() : setIdx(idx + 1));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="auto">
      {/* Dim layer — tapping anywhere advances */}
      <Pressable style={styles.scrim} onPress={next} />

      {/* Pulsing highlight around the feature */}
      {step.ring && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ring,
            step.ring,
            {
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.95, 0.45] }),
              transform: [
                { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) },
              ],
            },
          ]}
        />
      )}

      {/* Explaining card */}
      <View style={[styles.card, step.card]} pointerEvents="box-none">
        <View style={styles.cardHead}>
          {step.icon && (
            <View style={styles.cardIcon}>
              <Feather name={step.icon} size={16} color={theme.palette.forest} />
            </View>
          )}
          <Text style={styles.cardTitle}>{step.title}</Text>
        </View>
        <Text style={styles.cardBody}>{step.body}</Text>
        <View style={styles.cardFoot}>
          <Pressable onPress={onDone} hitSlop={8}>
            <Text style={styles.skip}>Skip tour</Text>
          </Pressable>
          <View style={styles.dots}>
            {steps.map((_, i) => (
              <View key={i} style={[styles.dot, i === idx && styles.dotActive]} />
            ))}
          </View>
          <Pressable style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextText}>{last ? 'Done' : 'Next'}</Text>
            {!last && <Feather name="chevron-right" size={15} color={theme.palette.cream} />}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(43,42,40,0.45)',
  },
  ring: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: theme.palette.cream,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  card: {
    position: 'absolute',
    maxWidth: 340,
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    padding: 18,
    gap: 10,
    ...theme.shadow.lift,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(78,102,82,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    flex: 1,
    fontFamily: theme.font.display,
    fontSize: 18,
    color: theme.color.fg1,
  },
  cardBody: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    lineHeight: 21,
    color: theme.color.fg2,
  },
  cardFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
  },
  skip: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    fontWeight: '600',
    color: theme.color.fg3,
  },
  dots: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(75,64,56,0.25)',
  },
  dotActive: { backgroundColor: theme.palette.forest, width: 14 },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 38,
    paddingHorizontal: 16,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.palette.forest,
  },
  nextText: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    fontWeight: '700',
    color: theme.palette.cream,
  },
});
