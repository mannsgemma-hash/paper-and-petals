import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Wordmark } from '../../src/components/Wordmark';
import { theme } from '../../src/theme/theme';
import { useAppStore, type Journal } from '../../src/store/app';
import { promptOfTheDay } from '../../src/data/prompts';
import { screen, track } from '../../src/lib/analytics';

// SCR-05 Home Screen. Toca-Boca-style journal carousel.
// Central featured journal with smaller neighbours peeking on either side.
// Arrows + swipe advance the active index; tapping any journal opens it in
// the editor. Top-left: logo + wordmark. Top-right: Shop and Settings.

const logoSage = require('../../assets/logos/logo_sage.png');

const CARD_W = 300;
const CARD_H = 420;
const STEP = 280;

export default function HomeScreen() {
  const router = useRouter();
  const journals = useAppStore((s) => s.journals);
  const addJournal = useAppStore((s) => s.addJournal);

  useEffect(() => {
    screen('Home');
  }, []);

  const [active, setActive] = useState(0);
  const dragDX = useRef(new Animated.Value(0)).current;
  const dragState = useRef({ dragging: false, lastDX: 0 });
  const { width, height } = useWindowDimensions();
  const compact = height < 560;

  const next = () => setActive((a) => Math.min(a + 1, journals.length - 1));
  const prev = () => setActive((a) => Math.max(a - 1, 0));

  const openJournal = (j: Journal) => {
    if (Math.abs(dragState.current.lastDX) > 5) return; // swipe, not tap
    if (j.isNew) {
      const created = addJournal();
      track('journal_opened', { journalId: created.id });
      router.push(`/editor/${created.id}`);
    } else {
      track('journal_opened', { journalId: j.id });
      router.push(`/editor/${j.id}`);
    }
  };

  // Swipe: only treat as a drag past a small threshold so taps still land.
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) =>
        Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: () => {
        dragState.current.dragging = true;
      },
      onPanResponderMove: (_e, g) => {
        dragState.current.lastDX = g.dx;
        dragDX.setValue(g.dx);
      },
      onPanResponderRelease: (_e, g) => {
        dragState.current.dragging = false;
        Animated.timing(dragDX, {
          toValue: 0,
          duration: theme.motion.durBase,
          useNativeDriver: true,
        }).start();
        if (Math.abs(g.dx) > 50) {
          if (g.dx < 0) next();
          else prev();
        }
        requestAnimationFrame(() => {
          dragState.current.lastDX = 0;
        });
      },
    })
  ).current;

  // Per-journal placement relative to the active index — neighbours sit a
  // step out, scaled down and tilted; far cards fade.
  const placement = (offset: number) => {
    const a = Math.abs(offset);
    if (a > 2.4) return null;
    const sgn = Math.sign(offset);
    const scale = a < 0.5 ? 1 : a < 1.5 ? 0.74 : 0.52;
    const tx = offset * STEP * (a < 1.5 ? 1 : 1.05);
    const rot = a < 0.5 ? 0 : sgn * (a < 1.5 ? 5 : 9);
    const ty = a < 0.5 ? 0 : a < 1.5 ? 14 : 26;
    const opacity = a < 0.5 ? 1 : a < 1.5 ? 0.95 : 0.4;
    const z = 10 - Math.round(a * 2);
    return { scale, tx, ty, rot, opacity, z };
  };

  const cardScale = compact ? 0.78 : 1;

  return (
    <Screen>
      {/* Top-left: logo + wordmark */}
      <View style={styles.brandRow}>
        <Image source={logoSage} style={styles.brandLogo} />
        <Wordmark size={22} />
      </View>

      {/* Top-right: shop + library + settings */}
      <View style={styles.topActions}>
        <TopButton
          label="Shop"
          icon="shopping-bag"
          color={theme.palette.terracotta}
          onPress={() => router.push('/(tabs)/shop')}
        />
        <TopButton
          label="Library"
          icon="book-open"
          color={theme.palette.forest}
          onPress={() => router.push('/library')}
        />
        <TopButton
          label="Settings"
          icon="settings"
          color={theme.palette.sage}
          onPress={() => router.push('/(tabs)/settings')}
        />
      </View>

      {/* Carousel */}
      <View style={styles.carousel} {...pan.panHandlers}>
        {journals.map((j, i) => {
          const p = placement(i - active);
          if (!p) return null;
          const isCenter = Math.abs(i - active) < 0.5;
          return (
            <Animated.View
              key={j.id}
              style={[
                styles.cardWrap,
                {
                  marginLeft: -CARD_W / 2,
                  marginTop: -CARD_H / 2,
                  zIndex: p.z,
                  opacity: p.opacity,
                  transform: [
                    { translateX: Animated.add(dragDX, new Animated.Value(p.tx)) },
                    { translateY: p.ty },
                    { scale: p.scale * cardScale },
                    { rotate: `${p.rot}deg` },
                  ],
                },
              ]}
            >
              <Pressable
                style={styles.cardPress}
                onPress={() => openJournal(j)}
              >
                <JournalCover journal={j} active={isCenter} />
              </Pressable>
            </Animated.View>
          );
        })}

        {/* Arrows */}
        <ArrowButton side="left" disabled={active === 0} onPress={prev} />
        <ArrowButton
          side="right"
          disabled={active === journals.length - 1}
          onPress={next}
        />
      </View>

      {/* Prompt of the day — a soft nudge, never a nag */}
      <View style={styles.promptRibbon} pointerEvents="none">
        <Feather name="feather" size={13} color={theme.palette.terracotta} />
        <Text style={styles.promptText} numberOfLines={1}>{promptOfTheDay()}</Text>
      </View>

      {/* Page indicators */}
      <View style={styles.dots}>
        {journals.map((j, i) => (
          <Pressable key={j.id} onPress={() => setActive(i)} hitSlop={6}>
            <View
              style={[
                styles.dot,
                i === active && styles.dotActive,
              ]}
            />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

function TopButton({
  label,
  icon,
  color,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.topBtn,
        { backgroundColor: color },
        pressed && { transform: [{ scale: 0.96 }] },
      ]}
    >
      <Feather name={icon} size={20} color={theme.palette.cream} />
      <Text style={styles.topBtnLabel}>{label}</Text>
    </Pressable>
  );
}

function ArrowButton({
  side,
  disabled,
  onPress,
}: {
  side: 'left' | 'right';
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.arrow,
        side === 'left' ? { left: 18 } : { right: 18 },
        disabled && { opacity: 0.35 },
      ]}
    >
      <Feather
        name={side === 'left' ? 'chevron-left' : 'chevron-right'}
        size={28}
        color={theme.color.fg1}
      />
    </Pressable>
  );
}

// One journal cover card — cognac leather with a brass label plate, spine
// darkening, stitched inner border, and a ribbon bookmark. `isNew` renders
// the dashed empty "start a new journal" slot.
function JournalCover({ journal, active }: { journal: Journal; active: boolean }) {
  if (journal.isNew) {
    return (
      <View style={[styles.newSlot, active && theme.shadow.lift]}>
        <View style={styles.newCircle}>
          <Text style={styles.newPlus}>＋</Text>
        </View>
        <Text style={styles.newLabel}>Start a new journal</Text>
      </View>
    );
  }

  return (
    <View style={[styles.cover, active ? theme.shadow.lift : theme.shadow.card]}>
      {/* Spine darkening on the binding edge */}
      <View style={styles.spine} />

      {/* Stitched inner border */}
      <View style={styles.stitchBorder} />

      {/* Brass label plate */}
      <View style={styles.brassPlate}>
        <Text style={styles.brassName} numberOfLines={1}>
          {journal.name}
        </Text>
        <Text style={styles.brassMeta}>
          {journal.items} items · {journal.edited}
        </Text>
      </View>

      {/* Ribbon bookmark */}
      <View style={styles.ribbon} />
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    position: 'absolute',
    top: 22,
    left: 24,
    zIndex: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogo: { width: 64, height: 64, resizeMode: 'contain' },
  topActions: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 6,
    flexDirection: 'row',
    gap: 12,
  },
  topBtn: {
    minWidth: 78,
    height: 56,
    paddingHorizontal: 16,
    borderRadius: theme.radius.pill,
    borderWidth: 2,
    borderColor: 'rgba(255,253,246,0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...theme.shadow.paper,
  },
  topBtnLabel: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    fontWeight: '600',
    color: theme.palette.cream,
  },
  carousel: {
    flex: 1,
    marginTop: 96,
    marginBottom: 60,
  },
  cardWrap: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: CARD_W,
    height: CARD_H,
  },
  cardPress: { flex: 1 },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,253,246,0.95)',
    borderWidth: theme.border.card,
    borderColor: theme.palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    ...theme.shadow.paper,
  },
  promptRibbon: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    zIndex: 4,
  },
  promptText: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: 16,
    color: theme.color.fg2,
    textAlign: 'center',
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(75,64,56,0.22)',
  },
  dotActive: {
    width: 24,
    backgroundColor: theme.palette.forest,
  },

  // Journal cover
  cover: {
    flex: 1,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#5A3D26',
    overflow: 'hidden',
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 18,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  stitchBorder: {
    position: 'absolute',
    top: 14,
    bottom: 14,
    left: 26,
    right: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,253,246,0.5)',
    borderRadius: 4,
  },
  brassPlate: {
    position: 'absolute',
    left: '17%',
    right: '9%',
    bottom: '14%',
    minHeight: 64,
    backgroundColor: '#D6BD78',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#7E6322',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  brassName: {
    fontFamily: theme.font.display,
    fontSize: 17,
    color: '#3A2C0F',
    maxWidth: '100%',
  },
  brassMeta: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: 12,
    color: '#5A4A1F',
    marginTop: 2,
  },
  ribbon: {
    position: 'absolute',
    right: 36,
    top: -2,
    width: 16,
    height: 56,
    backgroundColor: theme.palette.terracotta,
  },

  // New journal slot
  newSlot: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(75,64,56,0.32)',
    backgroundColor: '#EFE3CB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  newCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(75,64,56,0.30)',
    backgroundColor: 'rgba(255,253,246,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newPlus: {
    fontFamily: theme.font.display,
    fontSize: 44,
    color: 'rgba(75,64,56,0.55)',
  },
  newLabel: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: 22,
    color: theme.color.fg1,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
