import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Eyebrow } from '../src/components/Eyebrow';
import { theme } from '../src/theme/theme';
import { track } from '../src/lib/analytics';

// SCR-03 Package Opening. First-open-of-the-day ritual:
// wiggling postage box → tap → lid lifts, contents drift up →
// soft cross-fade to the pack reveal → tap anywhere → home.

type Phase = 'closed' | 'opening' | 'reveal';

const easePaper = Easing.bezier(0.32, 0.72, 0.32, 1);

const WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Today's real date, e.g. "Wednesday, 11 June". */
function formatDeliveryDate(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function PackageScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('closed');

  const boxOpacity = useRef(new Animated.Value(1)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;

  const handleTap = () => {
    if (phase === 'closed') {
      setPhase('opening');
      setTimeout(() => {
        setPhase('reveal');
        track('pack_opened');
        Animated.parallel([
          Animated.timing(boxOpacity, {
            toValue: 0,
            duration: 480,
            easing: easePaper,
            useNativeDriver: true,
          }),
          Animated.timing(revealOpacity, {
            toValue: 1,
            duration: 600,
            easing: easePaper,
            useNativeDriver: true,
          }),
        ]).start();
      }, 700);
    } else if (phase === 'reveal') {
      track('pack_dismissed');
      router.replace('/(tabs)');
    }
  };

  return (
    <Screen>
      <Pressable style={styles.stage} onPress={handleTap}>
        {/* Date eyebrow */}
        <Text style={styles.date}>{formatDeliveryDate(new Date())}</Text>
        <Text style={styles.arrived}>A SMALL PARCEL HAS ARRIVED</Text>

        {/* Closed / opening box */}
        <Animated.View
          style={[styles.center, { opacity: boxOpacity }]}
          pointerEvents="none"
        >
          <PostageBox phase={phase} />
        </Animated.View>

        {/* Pack reveal */}
        <Animated.View
          style={[styles.center, { opacity: revealOpacity }]}
          pointerEvents="none"
        >
          <PackReveal visible={phase === 'reveal'} />
        </Animated.View>

        {/* Tap hint */}
        <Text style={styles.hint}>
          {phase === 'closed' && 'TAP THE PARCEL WHEN YOU’RE READY'}
          {phase === 'opening' && ' '}
          {phase === 'reveal' && 'TAP ANYWHERE TO STEP INTO YOUR CRAFT ROOM'}
        </Text>
      </Pressable>
    </Screen>
  );
}

function PostageBox({ phase }: { phase: Phase }) {
  const wiggle = useRef(new Animated.Value(0)).current;
  const lid = useRef(new Animated.Value(0)).current;

  // Gentle wiggle loop while closed.
  useEffect(() => {
    if (phase !== 'closed') {
      wiggle.stopAnimation();
      wiggle.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wiggle, { toValue: 1, duration: 400, easing: easePaper, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: -1, duration: 800, easing: easePaper, useNativeDriver: true }),
        Animated.timing(wiggle, { toValue: 0, duration: 400, easing: easePaper, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [phase, wiggle]);

  // Lid tilts away on open.
  useEffect(() => {
    if (phase === 'opening') {
      Animated.timing(lid, {
        toValue: 1,
        duration: 700,
        easing: easePaper,
        useNativeDriver: true,
      }).start();
    }
  }, [phase, lid]);

  const rotate = wiggle.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-1.6deg', '1.6deg'],
  });
  const lidTranslate = lid.interpolate({ inputRange: [0, 1], outputRange: [0, -56] });
  const lidRotate = lid.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-24deg'] });
  const stringOpacity = lid.interpolate({ inputRange: [0, 0.5], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <Animated.View style={[styles.box, { transform: [{ rotate }] }]}>
      {/* Tissue paper rising */}
      <Animated.View
        style={[
          styles.tissue,
          {
            opacity: lid,
            transform: [
              {
                translateY: lid.interpolate({ inputRange: [0, 1], outputRange: [20, -20] }),
              },
            ],
          },
        ]}
      />

      {/* Body */}
      <View style={styles.boxBody}>
        {/* postage stamp */}
        <View style={styles.stamp}>
          <View style={styles.stampArt} />
          <Text style={styles.stampText}>P&P</Text>
        </View>
        {/* hand-stamped destination */}
        <Text style={styles.destination}>For you,{'\n'}with care</Text>
        {/* string ties */}
        <Animated.View style={[styles.stringV, { opacity: stringOpacity }]} />
        <Animated.View style={[styles.stringH, { opacity: stringOpacity }]} />
      </View>

      {/* Lid */}
      <Animated.View
        style={[
          styles.lid,
          { transform: [{ translateY: lidTranslate }, { rotate: lidRotate }] },
        ]}
      >
        <Animated.View style={[styles.lidStripe, { opacity: stringOpacity }]} />
      </Animated.View>
    </Animated.View>
  );
}

const PACK_ITEMS = [
  { label: 'VINTAGE PAPER', color: theme.palette.softRose, icon: 'file-text' as const, rot: '-4deg' },
  { label: 'PRESSED DAISY', color: theme.palette.mutedOlive, icon: 'feather' as const, rot: '3deg' },
  { label: 'POSTAGE STAMP', color: theme.palette.terracotta, icon: 'mail' as const, rot: '-6deg' },
  { label: 'WAX SEAL', color: theme.palette.forest, icon: 'disc' as const, rot: '0deg' },
];

function PackReveal({ visible }: { visible: boolean }) {
  return (
    <View style={styles.reveal}>
      <Eyebrow color={theme.palette.forest}>Today’s delivery</Eyebrow>
      <Text style={styles.revealTitle}>Four new pieces for your collection</Text>
      <Text style={styles.revealSub}>
        Saved straight to your craft room — nothing ever expires.
      </Text>
      <View style={styles.itemRow}>
        {PACK_ITEMS.map((it, i) => (
          <DriftItem key={it.label} item={it} delay={i * 120} active={visible} />
        ))}
      </View>
    </View>
  );
}

function DriftItem({
  item,
  delay,
  active,
}: {
  item: (typeof PACK_ITEMS)[number];
  delay: number;
  active: boolean;
}) {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;
    Animated.timing(drift, {
      toValue: 1,
      duration: 520,
      delay,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();
  }, [active, delay, drift]);

  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return (
    <Animated.View
      style={[styles.packItem, { opacity: drift, transform: [{ translateY }] }]}
    >
      <View style={[styles.packTile, { transform: [{ rotate: item.rot }] }]}>
        <Feather name={item.icon} size={34} color={item.color} />
      </View>
      <Text style={styles.packLabel}>{item.label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1 },
  date: {
    marginTop: 24,
    textAlign: 'center',
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: 20,
    color: theme.color.fg2,
  },
  arrived: {
    marginTop: 8,
    textAlign: 'center',
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.micro,
    letterSpacing: 2.8,
    color: theme.color.fg3,
    fontWeight: '600',
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 38,
    textAlign: 'center',
    fontFamily: theme.font.ui,
    fontSize: 12,
    letterSpacing: 2.6,
    color: theme.color.fg4,
    fontWeight: '600',
  },

  // Postage box
  box: { width: 320, height: 270 },
  boxBody: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 70,
    bottom: 0,
    backgroundColor: '#C4A377',
    borderRadius: theme.radius.sm,
    ...theme.shadow.card,
  },
  stamp: {
    position: 'absolute',
    left: 22,
    top: 22,
    width: 60,
    height: 76,
    backgroundColor: theme.palette.cream,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.palette.terracotta,
    borderRadius: 2,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampArt: {
    ...StyleSheet.absoluteFill,
    margin: 4,
    backgroundColor: theme.palette.softRose,
    borderRadius: 1,
  },
  stampText: {
    fontFamily: theme.font.display,
    fontSize: 20,
    color: theme.palette.cream,
    transform: [{ rotate: '-12deg' }],
    textShadowColor: 'rgba(75,64,56,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
  destination: {
    position: 'absolute',
    right: 28,
    top: 30,
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: 17,
    color: 'rgba(75,64,56,0.7)',
    transform: [{ rotate: '-3deg' }],
  },
  stringV: {
    position: 'absolute',
    left: '50%',
    marginLeft: -2,
    top: -10,
    bottom: -2,
    width: 4,
    backgroundColor: theme.palette.espresso,
  },
  stringH: {
    position: 'absolute',
    top: '52%',
    left: -2,
    right: -2,
    height: 4,
    backgroundColor: theme.palette.espresso,
  },
  lid: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 40,
    height: 60,
    backgroundColor: '#D3B289',
    borderRadius: theme.radius.sm,
    ...theme.shadow.paper,
  },
  lidStripe: {
    position: 'absolute',
    left: '50%',
    marginLeft: -2,
    top: 6,
    bottom: 6,
    width: 4,
    backgroundColor: theme.palette.espresso,
  },
  tissue: {
    position: 'absolute',
    left: 40,
    right: 40,
    top: 60,
    height: 90,
    backgroundColor: theme.palette.softRose,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  // Reveal
  reveal: { alignItems: 'center', gap: 14, paddingHorizontal: 24 },
  revealTitle: {
    fontFamily: theme.font.display,
    fontSize: 36,
    color: theme.color.fg1,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  revealSub: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: theme.fontSize.bodyLg,
    color: theme.color.fg2,
    textAlign: 'center',
    maxWidth: 480,
  },
  itemRow: { flexDirection: 'row', gap: 28, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' },
  packItem: { alignItems: 'center', gap: 10 },
  packTile: {
    width: 110,
    height: 130,
    backgroundColor: theme.palette.cream,
    borderWidth: theme.border.card,
    borderColor: theme.palette.hairline,
    borderRadius: theme.radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.tape,
  },
  packLabel: {
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.micro,
    letterSpacing: 2,
    color: theme.color.fg3,
    fontWeight: '600',
  },
});
