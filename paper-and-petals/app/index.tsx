import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { theme } from '../src/theme/theme';
import { useAppStore } from '../src/store/app';
import { markOpenedToday, resolveLaunchState } from '../src/lib/storage';

// SCR-01 Loading. Universal load splash: monogram seal cycling colourways,
// a rotating loading phrase, and a progress bar. When the bar fills, the stage
// soft-fades and routes by launch state (new → Welcome, first today → Package,
// returning → Home).

const LOGO_COLORWAYS = [
  require('../assets/logos/logo_sage.png'),
  require('../assets/logos/logo_terracotta.png'),
  require('../assets/logos/logo_mauve.png'),
  require('../assets/logos/logo_dusty_rose.png'),
  require('../assets/logos/logo_blue.png'),
  require('../assets/logos/logo_rose.png'),
];

export const LOADING_PHRASES = [
  'Tearing vintage paper',
  'Layering pretty things',
  'Pressing wildflowers',
  'Sorting the sticker drawer',
  'Hunting for ephemera',
  'Stitching paper scraps',
  'Adding washi tape',
  'Collecting tiny treasures',
  'Brewing creative ideas',
  'Flipping through old journals',
  'Arranging paper layers',
  'Inking botanical stamps',
  'Saving beautiful memories',
  'Drying flower petals',
  'Curating your craft desk',
  'Dusting off old postcards',
  'Organising the paper stash',
  'Snipping delicate florals',
  'Building cozy journal spreads',
  'Gathering scraps and stories',
  'Making fussy cuts',
];

const LOAD_DURATION = 8000;

export default function LoadingScreen() {
  const router = useRouter();
  const launchState = useAppStore((s) => s.launchState);
  const setLaunchState = useAppStore((s) => s.setLaunchState);

  // Real launch-state detection: 'new' until the welcome flow completes, then
  // 'first-today' on the first open of each day (daily delivery), otherwise
  // 'returning'. Resolves from persistent storage well before the bar fills.
  useEffect(() => {
    let cancelled = false;
    resolveLaunchState().then((state) => {
      if (cancelled) return;
      setLaunchState(state);
      // Stamp today's date now; the welcome flow stamps it itself for 'new'.
      if (state !== 'new') markOpenedToday();
    });
    return () => {
      cancelled = true;
    };
  }, [setLaunchState]);

  const [logoIdx, setLogoIdx] = useState(0);
  // Randomise phrase start so each load doesn't always begin with "Tearing…".
  const [phraseIdx, setPhraseIdx] = useState(() =>
    Math.floor(Math.random() * LOADING_PHRASES.length)
  );

  const progress = useRef(new Animated.Value(0)).current;
  const stageOpacity = useRef(new Animated.Value(1)).current;
  const routedRef = useRef(false);

  // Cycle the logo colourway every 500ms.
  useEffect(() => {
    const id = setInterval(
      () => setLogoIdx((i) => (i + 1) % LOGO_COLORWAYS.length),
      500
    );
    return () => clearInterval(id);
  }, []);

  // Advance the loading phrase every 3 seconds.
  useEffect(() => {
    const id = setInterval(
      () => setPhraseIdx((i) => (i + 1) % LOADING_PHRASES.length),
      3000
    );
    return () => clearInterval(id);
  }, []);

  // Fill the bar, then soft-fade and route by launch state.
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: LOAD_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (!finished || routedRef.current) return;
      routedRef.current = true;
      Animated.timing(stageOpacity, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }).start(() => {
        if (launchState === 'new') router.replace('/welcome');
        else if (launchState === 'first-today') router.replace('/package');
        else router.replace('/(tabs)');
      });
    });
  }, [launchState, progress, router, stageOpacity]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Screen>
      <Animated.View style={[styles.stage, { opacity: stageOpacity }]}>
        {/* logo seal — cycles through colourways */}
        <View style={styles.logoWrap}>
          {LOGO_COLORWAYS.map((src, i) => (
            <Image
              key={i}
              source={src}
              style={[styles.logo, { opacity: i === logoIdx ? 1 : 0 }]}
            />
          ))}
        </View>

        {/* rotating phrase */}
        <Text style={styles.phrase}>{LOADING_PHRASES[phraseIdx]}…</Text>

        {/* progress bar */}
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: barWidth }]} />
        </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 96,
  },
  logoWrap: { width: 260, height: 260 },
  logo: {
    position: 'absolute',
    width: 260,
    height: 260,
    resizeMode: 'contain',
  },
  phrase: {
    marginTop: 14,
    fontFamily: theme.font.ui,
    fontSize: 12,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: theme.color.fg4,
    textAlign: 'center',
  },
  track: {
    marginTop: 14,
    width: 220,
    height: 2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.palette.hairline,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: theme.color.accent,
  },
});
