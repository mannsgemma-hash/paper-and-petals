import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  runOnJS,
  Easing,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import Svg, { Polyline } from 'react-native-svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/theme/theme';
import { JOURNAL_FONTS, familyForFontKey } from '../../src/theme/fonts';
import { useAppStore } from '../../src/store/app';
import { DRAWER_CATEGORIES, SHOP_TONES, ShopItem } from '../../src/data/shop';
import { JOURNAL_TEMPLATES, type JournalTemplate } from '../../src/data/templates';
import { fetchLiveItems, sanityItemToShopItem } from '../../src/services/content';
import { supabase } from '../../src/lib/supabase';
import { screen, track } from '../../src/lib/analytics';

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_PAGES = 30;
const SPREAD_W = 720;
const SPREAD_H = 500;
const MIN_VIS = 30;
const PAGE_W = SPREAD_W / 2;
const DEFAULT_ITEM_SIZE = 120;
const MIN_ITEM_SIZE = 60;
const MAX_ITEM_SIZE = 380;
// Rotate handle sits below the selection frame: 14px stem + half of the 26px knob.
const ROTATE_HANDLE_DIST = 14 + 13;
const FLIP_DURATION = 310; // per half-turn — 620ms total
const FLIP_EASING = Easing.bezier(0.32, 0.72, 0.32, 1);

// Text tool — rendered font size tracks the box height so resize handles scale
// the lettering for free; tune TEXT_FILL to taste.
const TEXT_FILL = 0.55;
const NEW_TEXT_W = 240;
const NEW_TEXT_H = 72;
// Washi tape — a stretchy strip; corner handles resize length and width
// independently (unlike the proportional scale used by every other kind).
const TAPE_W = 200;
const TAPE_H = 32;
const TAPE_MIN_W = 40;
const TAPE_MAX_W = SPREAD_W;
const TAPE_MIN_H = 14;
const TAPE_MAX_H = 90;
/** Tape tones cycled by the tape tool, in placement order. */
const TAPE_TONES: (keyof typeof SHOP_TONES)[] = ['sage', 'rose', 'amber', 'blue', 'mauve', 'cream'];

// Doodle pen
const DOODLE_STROKE = 3;
const DOODLE_MIN_BOX = 24;

/** Soft paper lift behind items when their shadow toggle is on. */
const ITEM_SHADOW = {
  shadowColor: '#4B4038',
  shadowOpacity: 0.32,
  shadowRadius: 7,
  shadowOffset: { width: 0, height: 5 },
  elevation: 6,
} as const;

/** Warm ink colours offered by the text editor, drawn from the brand palette. */
const TEXT_COLORS = [
  theme.palette.charcoal,
  theme.palette.espresso,
  theme.palette.forest,
  theme.palette.terracotta,
  theme.palette.mauve,
  theme.palette.dustyBlue,
  theme.palette.antiqueGold,
  theme.palette.danger,
  theme.palette.mutedOlive,
  theme.palette.cream,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Cross-platform confirm: window.confirm on web (Alert buttons are no-ops there). */
function confirmAsync(title: string, message: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Delete', style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

function noop() {}

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlacedItem {
  id: string;
  itemId: string;
  /** 'item' (shop art / glyph), 'text', 'photo', 'tape' (washi strip), 'doodle' (pen stroke). */
  kind?: 'item' | 'text' | 'photo' | 'tape' | 'doodle';
  glyph: string;
  tone: string;
  flowerAsset?: number | { uri: string };
  // Text-tool fields (kind === 'text')
  text?: string;
  fontKey?: string;
  color?: string;
  // Doodle fields (kind === 'doodle'): stroke points in [0..srcW]×[0..srcH]
  points?: { x: number; y: number }[];
  srcW?: number;
  srcH?: number;
  /** Paper-lift drop shadow toggle. */
  shadow?: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  z: number;
}

interface PageState {
  items: PlacedItem[];
}

// ─── Flower assets ────────────────────────────────────────────────────────────

const FLOWER_ASSETS = [
  require('../../assets/flowers/01-cornflower-violet.png'),
  require('../../assets/flowers/02-poppy-red.png'),
  require('../../assets/flowers/03-cosmos-lavender.png'),
  require('../../assets/flowers/04-wildrose-pink.png'),
  require('../../assets/flowers/05-cherryblossom-cluster.png'),
  require('../../assets/flowers/06-zinnia-crimson.png'),
];

// ─── Drawer items catalogue ───────────────────────────────────────────────────

const DRAWER_ITEMS: Record<string, { id: string; glyph: string; tone: keyof typeof SHOP_TONES; flowerAsset?: number }[]> = {
  collections: [
    { id: 'col-1', glyph: 'package', tone: 'sage' }, { id: 'col-2', glyph: 'package', tone: 'rose' },
    { id: 'col-3', glyph: 'package', tone: 'blue' }, { id: 'col-4', glyph: 'package', tone: 'amber' },
  ],
  papers: [
    { id: 'pap-1', glyph: 'file-text', tone: 'cream' }, { id: 'pap-2', glyph: 'file-text', tone: 'sage' },
    { id: 'pap-3', glyph: 'file', tone: 'amber' }, { id: 'pap-4', glyph: 'file', tone: 'rose' },
    { id: 'pap-5', glyph: 'file-text', tone: 'mauve' }, { id: 'pap-6', glyph: 'file', tone: 'blue' },
  ],
  stickers: [
    { id: 'stk-1', glyph: 'disc', tone: 'oxblood' }, { id: 'stk-2', glyph: 'star', tone: 'amber' },
    { id: 'stk-3', glyph: 'heart', tone: 'rose' }, { id: 'stk-4', glyph: 'check', tone: 'sage' },
    { id: 'stk-5', glyph: 'arrow-right', tone: 'forest' }, { id: 'stk-6', glyph: 'star', tone: 'gold' },
  ],
  tape: [
    { id: 'tap-1', glyph: 'minus', tone: 'sage' }, { id: 'tap-2', glyph: 'minus', tone: 'rose' },
    { id: 'tap-3', glyph: 'minus', tone: 'amber' }, { id: 'tap-4', glyph: 'paperclip', tone: 'gold' },
    { id: 'tap-5', glyph: 'link', tone: 'mauve' },
  ],
  ephemera: [
    { id: 'eph-1', glyph: 'mail', tone: 'oxblood' }, { id: 'eph-2', glyph: 'credit-card', tone: 'mauve' },
    { id: 'eph-3', glyph: 'mail', tone: 'cream' }, { id: 'eph-4', glyph: 'credit-card', tone: 'amber' },
  ],
  florals: FLOWER_ASSETS.map((asset, i) => ({
    id: `flo-${i}`,
    glyph: 'feather',
    tone: (['mauve', 'oxblood', 'blue', 'rose', 'rose', 'oxblood'] as const)[i],
    flowerAsset: asset,
  })),
  frames: [
    { id: 'frm-1', glyph: 'circle', tone: 'gold' }, { id: 'frm-2', glyph: 'square', tone: 'gold' },
    { id: 'frm-3', glyph: 'tag', tone: 'cream' },
  ],
  type: [
    { id: 'typ-1', glyph: 'edit-3', tone: 'forest' }, { id: 'typ-2', glyph: 'hash', tone: 'oxblood' },
    { id: 'typ-3', glyph: 'type', tone: 'cream' },
  ],
  paint: [
    { id: 'pnt-1', glyph: 'droplet', tone: 'rose' }, { id: 'pnt-2', glyph: 'edit-2', tone: 'sage' },
    { id: 'pnt-3', glyph: 'edit-2', tone: 'mauve' },
  ],
  fabric: [
    { id: 'fab-1', glyph: 'layers', tone: 'sage' }, { id: 'fab-2', glyph: 'layers', tone: 'cream' },
    { id: 'fab-3', glyph: 'x', tone: 'rose' },
  ],
  photos: [
    { id: 'pho-1', glyph: 'image', tone: 'cream' }, { id: 'pho-2', glyph: 'copy', tone: 'blue' },
  ],
  details: [
    { id: 'det-1', glyph: 'sun', tone: 'cream' }, { id: 'det-2', glyph: 'gift', tone: 'oxblood' },
    { id: 'det-3', glyph: 'gift', tone: 'rose' },
  ],
};

// ─── PlacedItemView ───────────────────────────────────────────────────────────

interface PlacedItemViewProps {
  item: PlacedItem;
  isSelected: boolean;
  spreadScale: number;
  onSelect: (id: string) => void;
  onMoveEnd: (id: string, x: number, y: number) => void;
  onResizeEnd: (id: string, w: number, h: number) => void;
  onRotateEnd: (id: string, rotate: number) => void;
  onRequestEdit: (id: string) => void;
}

function PlacedItemView({
  item,
  isSelected,
  spreadScale,
  onSelect,
  onMoveEnd,
  onResizeEnd,
  onRotateEnd,
  onRequestEdit,
}: PlacedItemViewProps) {
  const tx = useSharedValue(item.x);
  const ty = useSharedValue(item.y);
  const rot = useSharedValue(item.rotate);
  const itemW = useSharedValue(item.w);
  const itemH = useSharedValue(item.h);

  // Sync when item prop changes from undo/redo or external updates
  useEffect(() => {
    tx.value = item.x;
    ty.value = item.y;
    rot.value = item.rotate;
    itemW.value = item.w;
    itemH.value = item.h;
  }, [item.x, item.y, item.rotate, item.w, item.h]);

  const startX = useSharedValue(item.x);
  const startY = useSharedValue(item.y);
  const startW = useSharedValue(item.w);
  const startH = useSharedValue(item.h);
  const startRot = useSharedValue(item.rotate);

  // Edge-based clamp: the item occupies [x - w/2, x + w/2]; at least MIN_VIS px
  // of it must stay inside the spread. Off the LEFT edge: x + w/2 >= MIN_VIS,
  // so x >= MIN_VIS - w/2. Off the RIGHT edge: x - w/2 <= SPREAD_W - MIN_VIS,
  // so x <= SPREAD_W - MIN_VIS + w/2. (Axis-aligned approximation; rotation
  // makes the exact visible-area math more complex than it is worth.)
  function clampX(x: number) {
    'worklet';
    return Math.max(
      MIN_VIS - itemW.value / 2,
      Math.min(SPREAD_W - MIN_VIS + itemW.value / 2, x),
    );
  }

  function clampY(y: number) {
    'worklet';
    return Math.max(
      MIN_VIS - itemH.value / 2,
      Math.min(SPREAD_H - MIN_VIS + itemH.value / 2, y),
    );
  }

  // runOnJS(true): run the callback directly on the JS thread so a mouse click
  // on web reliably re-selects the item.
  const tapGesture = Gesture.Tap()
    .maxDeltaX(8)
    .maxDeltaY(8)
    .runOnJS(true)
    .onEnd(() => {
      onSelect(item.id);
    });

  // Double-tap opens the text editor for text items (Canva-style).
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDeltaX(8)
    .maxDeltaY(8)
    .runOnJS(true)
    .onEnd(() => {
      if (item.kind === 'text') onRequestEdit(item.id);
      else onSelect(item.id);
    });

  const panGesture = Gesture.Pan()
    .minDistance(6)
    .onBegin(() => {
      startX.value = tx.value;
      startY.value = ty.value;
    })
    .onUpdate((e) => {
      tx.value = clampX(startX.value + e.translationX / spreadScale);
      ty.value = clampY(startY.value + e.translationY / spreadScale);
    })
    .onEnd(() => {
      runOnJS(onMoveEnd)(item.id, tx.value, ty.value);
    });

  // Two-finger pinch/rotate kept as a bonus for touch devices; the corner and
  // rotate handles below are the primary (mouse-friendly) path.
  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      startW.value = itemW.value;
      startH.value = itemH.value;
    })
    .onUpdate((e) => {
      const newW = Math.max(MIN_ITEM_SIZE, Math.min(MAX_ITEM_SIZE, startW.value * e.scale));
      const newH = Math.max(MIN_ITEM_SIZE, Math.min(MAX_ITEM_SIZE, startH.value * e.scale));
      itemW.value = newW;
      itemH.value = newH;
    })
    .onEnd(() => {
      runOnJS(onResizeEnd)(item.id, itemW.value, itemH.value);
    });

  const rotationGesture = Gesture.Rotation()
    .onBegin(() => {
      startRot.value = rot.value;
    })
    .onUpdate((e) => {
      const rawDeg = startRot.value + (e.rotation * 180) / Math.PI;
      const snapped = Math.round(rawDeg / 15) * 15;
      rot.value = Math.abs(rawDeg - snapped) < 3 ? snapped : rawDeg;
    })
    .onEnd(() => {
      runOnJS(onRotateEnd)(item.id, rot.value);
    });

  const composed = Gesture.Race(
    Gesture.Simultaneous(pinchGesture, rotationGesture),
    Gesture.Simultaneous(Gesture.Exclusive(doubleTapGesture, tapGesture), panGesture),
  );

  // ── Handle drag state (one drag at a time, so one pair is enough) ──────────
  // Start vector: handle position relative to the item center, in screen px.
  const startVX = useSharedValue(0);
  const startVY = useSharedValue(0);

  /**
   * Corner resize handle: proportional scale from the item center — except
   * washi tape, which stretches length and width independently.
   */
  function makeCornerGesture(hx: number, hy: number) {
    const isTape = item.kind === 'tape';
    return Gesture.Pan()
      .onBegin(() => {
        startW.value = itemW.value;
        startH.value = itemH.value;
        const rad = (rot.value * Math.PI) / 180;
        const lx = (hx * itemW.value) / 2;
        const ly = (hy * itemH.value) / 2;
        // Rotate the local corner vector into screen space, then scale.
        startVX.value = (lx * Math.cos(rad) - ly * Math.sin(rad)) * spreadScale;
        startVY.value = (lx * Math.sin(rad) + ly * Math.cos(rad)) * spreadScale;
      })
      .onUpdate((e) => {
        if (isTape) {
          // Free stretch: rotate the screen-space drag into item-local axes.
          const rad = (rot.value * Math.PI) / 180;
          const ldx = (e.translationX * Math.cos(rad) + e.translationY * Math.sin(rad)) / spreadScale;
          const ldy = (-e.translationX * Math.sin(rad) + e.translationY * Math.cos(rad)) / spreadScale;
          itemW.value = Math.max(TAPE_MIN_W, Math.min(TAPE_MAX_W, startW.value + 2 * hx * ldx));
          itemH.value = Math.max(TAPE_MIN_H, Math.min(TAPE_MAX_H, startH.value + 2 * hy * ldy));
          return;
        }
        const d0 = Math.sqrt(startVX.value * startVX.value + startVY.value * startVY.value);
        if (d0 < 1) return;
        const vx = startVX.value + e.translationX;
        const vy = startVY.value + e.translationY;
        const d = Math.sqrt(vx * vx + vy * vy);
        // Clamp the factor so both dimensions stay in range without breaking aspect.
        const fMin = MIN_ITEM_SIZE / Math.min(startW.value, startH.value);
        const fMax = MAX_ITEM_SIZE / Math.max(startW.value, startH.value);
        const f = Math.max(fMin, Math.min(fMax, d / d0));
        itemW.value = startW.value * f;
        itemH.value = startH.value * f;
      })
      .onEnd(() => {
        runOnJS(onResizeEnd)(item.id, itemW.value, itemH.value);
      });
  }

  /** Rotate handle: angle of the pointer around the item center, soft 15° snap. */
  const rotateHandleGesture = Gesture.Pan()
    .onBegin(() => {
      const dist = itemH.value / 2 + ROTATE_HANDLE_DIST;
      const rad = (rot.value * Math.PI) / 180;
      // Handle starts below the center: local vector (0, +dist) rotated into screen space.
      startVX.value = -dist * Math.sin(rad) * spreadScale;
      startVY.value = dist * Math.cos(rad) * spreadScale;
    })
    .onUpdate((e) => {
      const vx = startVX.value + e.translationX;
      const vy = startVY.value + e.translationY;
      // -90: the handle hangs below the item, atan2 of "down" is +90.
      const deg = (Math.atan2(vy, vx) * 180) / Math.PI - 90;
      const snapped = Math.round(deg / 15) * 15;
      rot.value = Math.abs(deg - snapped) < 3 ? snapped : deg;
    })
    .onEnd(() => {
      runOnJS(onRotateEnd)(item.id, rot.value);
    });

  const animStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: tx.value - itemW.value / 2,
    top: ty.value - itemH.value / 2,
    width: itemW.value,
    height: itemH.value,
    transform: [{ rotate: `${rot.value}deg` }],
    zIndex: isSelected ? 9999 : item.z,
  }));

  // Live font sizing for text items: the lettering tracks the box height so the
  // corner resize handles scale text for free.
  const textAnimStyle = useAnimatedStyle(() => ({
    fontSize: Math.max(8, itemH.value * TEXT_FILL),
  }));

  const toneKey = item.tone as keyof typeof SHOP_TONES;
  const { bg, accent } = SHOP_TONES[toneKey] ?? SHOP_TONES.sage;
  const isText = item.kind === 'text';
  const isPhoto = item.kind === 'photo';
  const isTape = item.kind === 'tape';
  const isDoodle = item.kind === 'doodle';
  const liftShadow = item.shadow ? ITEM_SHADOW : undefined;

  const CORNERS = [
    { hx: -1, hy: -1 },
    { hx: 1, hy: -1 },
    { hx: 1, hy: 1 },
    { hx: -1, hy: 1 },
  ];

  // Frame + handles live INSIDE the rotated container so they track rotation
  // (Canva-style). Handles sit as siblings of the content's GestureDetector so
  // their pans never compete with the move pan.
  return (
    <Animated.View style={animStyle}>
      <GestureDetector gesture={composed}>
        <Animated.View style={styles.itemFill}>
          {isText ? (
            <View style={styles.textItemInner}>
              <Animated.Text
                style={[
                  styles.textItem,
                  { fontFamily: familyForFontKey(item.fontKey), color: item.color ?? theme.palette.charcoal },
                  textAnimStyle,
                ]}
              >
                {item.text || ' '}
              </Animated.Text>
            </View>
          ) : isPhoto ? (
            <View style={[styles.photoInner, liftShadow]}>
              <Image source={item.flowerAsset as any} style={styles.photoImage} resizeMode="cover" />
            </View>
          ) : isTape ? (
            <View style={[styles.tapeInner, { backgroundColor: bg }, liftShadow]}>
              {/* Torn-looking ends: lighter notches biting into each end */}
              <View style={[styles.tapeNotch, { left: -5 }]} />
              <View style={[styles.tapeNotch, { right: -5 }]} />
            </View>
          ) : isDoodle ? (
            <Svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${item.srcW ?? 1} ${item.srcH ?? 1}`}
              preserveAspectRatio="none"
            >
              <Polyline
                points={(item.points ?? []).map((p) => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={item.color ?? theme.palette.charcoal}
                strokeWidth={DOODLE_STROKE}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : (
            <View style={[styles.itemInner, !item.flowerAsset && { backgroundColor: bg }, liftShadow]}>
              {item.flowerAsset ? (
                <Image source={item.flowerAsset as any} style={styles.itemImage} resizeMode="contain" />
              ) : (
                <Feather name={item.glyph as any} size={Math.min(item.w, item.h) * 0.4} color={accent} />
              )}
            </View>
          )}
        </Animated.View>
      </GestureDetector>

      {isSelected && (
        <>
          {/* Selection frame */}
          <View style={styles.selectionFrame} pointerEvents="none" />

          {/* Corner resize handles */}
          {CORNERS.map(({ hx, hy }) => (
            <GestureDetector key={`${hx},${hy}`} gesture={makeCornerGesture(hx, hy)}>
              <View
                style={[
                  styles.handleTouch,
                  hx < 0 ? { left: -8 } : { right: -8 },
                  hy < 0 ? { top: -8 } : { bottom: -8 },
                ]}
              >
                <View style={styles.handleDot} />
              </View>
            </GestureDetector>
          ))}

          {/* Rotate handle: stem + knob below the frame */}
          <View style={styles.rotateHandleWrap} pointerEvents="box-none">
            <View style={styles.rotateStem} />
            <GestureDetector gesture={rotateHandleGesture}>
              <View style={styles.rotateHandle}>
                <Feather name="rotate-cw" size={13} color={theme.palette.forest} />
              </View>
            </GestureDetector>
          </View>
        </>
      )}
    </Animated.View>
  );
}

// ─── LeatherCover ─────────────────────────────────────────────────────────────

function LeatherCover({ side }: { side: 'left' | 'right' }) {
  return (
    <View style={[styles.page, styles.leather, side === 'left' ? styles.pageLeft : styles.pageRight]}>
      <View style={styles.monogram}>
        <Text style={styles.monogramText}>P&P</Text>
      </View>
      <Text style={styles.leatherLabel}>{side === 'left' ? 'FRONT COVER · INSIDE' : 'BACK COVER · INSIDE'}</Text>
    </View>
  );
}

// ─── PaperPage ────────────────────────────────────────────────────────────────

function PaperPage({ pageNo }: { pageNo: number }) {
  return (
    <View style={[styles.page, styles.paper]}>
      <Text style={styles.pageNo}>{pageNo}</Text>
    </View>
  );
}

// ─── ItemToolbar ──────────────────────────────────────────────────────────────

interface ItemToolbarProps {
  left: number;
  top: number;
  onBringForward: () => void;
  onSendBack: () => void;
  onDelete: () => void;
  onEditText?: () => void;
  onToggleShadow?: () => void;
  shadowOn?: boolean;
}

function ItemToolbar({
  left,
  top,
  onBringForward,
  onSendBack,
  onDelete,
  onEditText,
  onToggleShadow,
  shadowOn,
}: ItemToolbarProps) {
  return (
    <View style={[styles.toolbar, { left, top }]}>
      {onEditText && (
        <>
          <Pressable style={styles.toolBtn} onPress={onEditText} hitSlop={4}>
            <Feather name="edit-2" size={16} color={theme.palette.forest} />
          </Pressable>
          <View style={styles.toolDivider} />
        </>
      )}
      {onToggleShadow && (
        <>
          <Pressable
            style={[styles.toolBtn, shadowOn && styles.toolBtnActive]}
            onPress={onToggleShadow}
            hitSlop={4}
          >
            <Feather name="sun" size={16} color={shadowOn ? theme.palette.forest : theme.color.fg1} />
          </Pressable>
          <View style={styles.toolDivider} />
        </>
      )}
      <Pressable style={styles.toolBtn} onPress={onBringForward} hitSlop={4}>
        <Feather name="chevrons-up" size={16} color={theme.color.fg1} />
      </Pressable>
      <Pressable style={styles.toolBtn} onPress={onSendBack} hitSlop={4}>
        <Feather name="chevrons-down" size={16} color={theme.color.fg1} />
      </Pressable>
      <View style={styles.toolDivider} />
      <Pressable style={[styles.toolBtn, styles.toolDanger]} onPress={onDelete} hitSlop={4}>
        <Feather name="trash-2" size={16} color={theme.palette.terracotta} />
      </Pressable>
    </View>
  );
}

// ─── DrawerBody ───────────────────────────────────────────────────────────────

/** Visible categories in the editor drawer — exclude 'all' and 'collections'. */
const EDITOR_CATEGORIES = DRAWER_CATEGORIES.filter((c) => c.id !== 'collections');

interface DrawerBodyProps {
  shopItems: ShopItem[];
  drawerCat: string;
  setDrawerCat: (cat: string) => void;
  placeItem: (item: { id: string; glyph: string; tone: string; flowerAsset?: number | { uri: string } }) => void;
  hoveredCategory: string | null;
  setHoveredCategory: (id: string | null) => void;
}

function DrawerBody({ shopItems, drawerCat, setDrawerCat, placeItem, hoveredCategory, setHoveredCategory }: DrawerBodyProps) {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const ownedItems = useAppStore((s) => s.ownedItems);
  const recentItemIds = useAppStore((s) => s.recentItemIds);

  const isOwned = (item: ShopItem) =>
    item.price === 0 || item.owned || !!ownedItems[item.id];

  // Build a map from category key → ShopItem[], fallback to DRAWER_ITEMS if store is empty
  const itemsByCategory: Record<string, ShopItem[]> = shopItems.length > 0
    ? shopItems.reduce(
        (acc, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        },
        {} as Record<string, ShopItem[]>,
      )
    : Object.fromEntries(
        Object.entries(DRAWER_ITEMS).map(([cat, items]) => [
          cat,
          items.map((it) => ({
            id: it.id,
            category: cat,
            name: it.id,
            price: 0,
            tone: it.tone as ShopItem['tone'],
            glyph: it.glyph as ShopItem['glyph'],
            flowerAsset: it.flowerAsset,
            desc: '',
            items: 0,
            owned: true,
            isNew: false,
          })),
        ]),
      );

  // Flat list of everything owned (excluding collections) for search + recents.
  const allOwned = Object.values(itemsByCategory)
    .flat()
    .filter((item) => item.category !== 'collections' && isOwned(item));

  const q = query.trim().toLowerCase();
  // Search spans the whole owned collection; otherwise show the active category.
  const visibleItems = q
    ? allOwned.filter((item) => item.name.toLowerCase().includes(q))
    : (itemsByCategory[drawerCat] ?? []).filter(
        (item) => item.category !== 'collections' && isOwned(item),
      );

  // Recently used — only when not searching and we have history.
  const recents = !q
    ? recentItemIds
        .map((id) => allOwned.find((it) => it.id === id))
        .filter((it): it is ShopItem => !!it)
        .slice(0, 8)
    : [];

  const renderTile = (item: ShopItem, keyPrefix = '') => {
    const toneKey = item.tone as keyof typeof SHOP_TONES;
    const tone = SHOP_TONES[toneKey] ?? SHOP_TONES.sage;
    return (
      <View key={keyPrefix + item.id} style={styles.tileWrapper}>
        <Pressable
          style={[
            styles.tile,
            item.flowerAsset ? { backgroundColor: theme.palette.cream } : { backgroundColor: tone.bg },
            item.isNew && styles.tileNew,
          ]}
          onPress={() =>
            placeItem({ id: item.id, glyph: item.glyph, tone: item.tone, flowerAsset: item.flowerAsset })
          }
          {...({
            onPointerEnter: () => setHoveredItemId(keyPrefix + item.id),
            onPointerLeave: () => setHoveredItemId(null),
          } as any)}
        >
          {item.flowerAsset ? (
            <Image source={item.flowerAsset} style={styles.tileFlower} resizeMode="contain" />
          ) : (
            <Feather name={item.glyph as any} size={28} color={tone.accent} />
          )}
          {item.isNew && (
            <View style={styles.tileNewTag}>
              <Text style={styles.tileNewText}>NEW</Text>
            </View>
          )}
        </Pressable>
        {hoveredItemId === keyPrefix + item.id && (
          <View style={styles.itemTooltip} pointerEvents="none">
            <Text style={styles.tooltipText}>{item.name}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.drawerBody}>
      <View style={styles.drawerLeft}>
        {/* Search */}
        <View style={styles.drawerSearch}>
          <Feather name="search" size={16} color={theme.color.fg3} />
          <TextInput
            style={styles.drawerSearchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search your collection…"
            placeholderTextColor={theme.color.fg4}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Feather name="x" size={14} color={theme.color.fg3} />
            </Pressable>
          )}
        </View>

        {/* Item grid */}
        <ScrollView contentContainerStyle={visibleItems.length === 0 ? styles.drawerEmpty : undefined}>
          {/* Recently used */}
          {recents.length > 0 && (
            <>
              <Text style={styles.drawerSectionLabel}>RECENTLY USED</Text>
              <View style={styles.drawerGrid}>{recents.map((it) => renderTile(it, 'recent-'))}</View>
              <View style={styles.drawerSectionDivider} />
              <Text style={styles.drawerSectionLabel}>
                {EDITOR_CATEGORIES.find((c) => c.id === drawerCat)?.label?.toUpperCase()}
              </Text>
            </>
          )}

          {visibleItems.length === 0 ? (
            <View style={styles.drawerEmptyInner}>
              <Feather name={q ? 'search' : 'lock'} size={22} color={theme.color.fg4} />
              <Text style={styles.drawerEmptyText}>
                {q ? 'Nothing matches that' : 'No items owned here yet'}
              </Text>
              <Text style={styles.drawerEmptyHint}>
                {q ? 'Try another word.' : 'Visit the shop to add items to your collection'}
              </Text>
            </View>
          ) : (
            <View style={styles.drawerGrid}>{visibleItems.map((it) => renderTile(it))}</View>
          )}
        </ScrollView>
      </View>

      {/* Category tabs on the right edge */}
      <ScrollView style={styles.tabRail} contentContainerStyle={styles.tabRailContent}>
        {EDITOR_CATEGORIES.map((c) => {
          const isActive = c.id === drawerCat;
          return (
            <View key={c.id} style={styles.tabWrapper}>
              <Pressable
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setDrawerCat(c.id)}
                {...({
                  onPointerEnter: () => setHoveredCategory(c.id),
                  onPointerLeave: () => setHoveredCategory(null),
                } as any)}
              >
                <Feather
                  name={c.icon}
                  size={18}
                  color={isActive ? theme.palette.forest : theme.color.fg3}
                />
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      {/* Category tooltip — sibling to both ScrollViews so it's never clipped */}
      {hoveredCategory && (() => {
        const idx = EDITOR_CATEGORIES.findIndex(c => c.id === hoveredCategory);
        const label = EDITOR_CATEGORIES[idx]?.label;
        if (!label) return null;
        // top relative to drawerBody: 8px tabRail paddingTop + idx * 44 (tab 40 + gap 4) + 20 (half tab)
        const topOffset = 8 + idx * 44 + 20;
        return (
          <View
            style={[styles.catTooltip, { top: topOffset, right: 52 }]}
            pointerEvents="none"
          >
            <Text style={styles.tooltipText}>{label}</Text>
          </View>
        );
      })()}
    </View>
  );
}

// ─── Page flip (only the turning half rotates, hinged at the spine) ──────────

interface FlipState {
  dir: 'next' | 'prev';
  from: number;
  to: number;
  /** Phase A: current page lifts 0→±90. Phase B: destination page lands ∓90→0. */
  phase: 'A' | 'B';
}

/**
 * One half of a spread, clipped out of a full SpreadView render. Used for the
 * static base under a flip and for the faces of the turning page.
 */
function SpreadHalf({ pages, page, side }: { pages: PageState[]; page: number; side: 'left' | 'right' }) {
  return (
    <View style={styles.spreadHalfClip} pointerEvents="none">
      <View style={[styles.spreadHalfShift, side === 'right' && { marginLeft: -PAGE_W }]}>
        <SpreadView
          pages={pages}
          activePage={page}
          selectedId={null}
          spreadScale={1}
          onCanvasTap={noop}
          onSelect={noop}
          onMoveEnd={noop}
          onResizeEnd={noop}
          onRotateEnd={noop}
          onRequestEdit={noop}
        />
      </View>
    </View>
  );
}

/**
 * The turning page: a page-sized layer over one half of the spread, rotating
 * in Y around the spine edge. The translateX sandwich moves the rotation axis
 * from the center to the spine-side edge. A dark overlay fades 0 → 0.18 → 0
 * as the page lifts.
 */
function FlipPage({
  side,
  rot,
  children,
}: {
  side: 'left' | 'right';
  rot: SharedValue<number>;
  children: React.ReactNode;
}) {
  // Right half hinges on its LEFT edge; left half hinges on its RIGHT edge.
  const hinge = side === 'right' ? 1 : -1;
  const pageStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { translateX: -hinge * (PAGE_W / 2) },
      { rotateY: `${rot.value}deg` },
      { translateX: hinge * (PAGE_W / 2) },
    ],
  }));
  const shadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(Math.abs(rot.value), [0, 90], [0, 0.18]),
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.flipPage, { left: side === 'right' ? PAGE_W : 0 }, pageStyle]}
    >
      {children}
      <Animated.View style={[StyleSheet.absoluteFill, styles.flipShade, shadeStyle]} />
    </Animated.View>
  );
}

// ─── SpreadView ───────────────────────────────────────────────────────────────

interface SpreadViewProps {
  pages: PageState[];
  activePage: number;
  selectedId: string | null;
  spreadScale: number;
  onCanvasTap: () => void;
  onSelect: (id: string) => void;
  onMoveEnd: (id: string, x: number, y: number) => void;
  onResizeEnd: (id: string, w: number, h: number) => void;
  onRotateEnd: (id: string, rotate: number) => void;
  onRequestEdit: (id: string) => void;
}

function SpreadView({
  pages,
  activePage,
  selectedId,
  spreadScale,
  onCanvasTap,
  onSelect,
  onMoveEnd,
  onResizeEnd,
  onRotateEnd,
  onRequestEdit,
}: SpreadViewProps) {
  const isFirstPage = activePage === 1;
  const isLastPage = activePage === pages.length;
  const items = pages[activePage - 1]?.items ?? [];

  return (
    <View style={styles.spreadInner}>
      {/* Left page */}
      {isFirstPage ? (
        <LeatherCover side="left" />
      ) : (
        <PaperPage pageNo={activePage * 2 - 2} />
      )}
      {/* Spine shadow */}
      <View style={styles.spineShadow} />
      {/* Right page */}
      {isLastPage ? (
        <LeatherCover side="right" />
      ) : (
        <PaperPage pageNo={activePage * 2 - 1} />
      )}
      {/* Background tap-to-deselect — the lowest layer. It must NOT wrap the
          items: a parent Pressable's onPress can fire instead of (or race) a
          child's tap gesture, especially on web. */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onCanvasTap} />
      {/* Items layer — rendered after (above) the background as a sibling, so
          each item's own tap gesture wins; box-none lets clicks on empty
          space fall through to the deselect layer. */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {items.map((item) => (
          <PlacedItemView
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            spreadScale={spreadScale}
            onSelect={onSelect}
            onMoveEnd={onMoveEnd}
            onResizeEnd={onResizeEnd}
            onRotateEnd={onRotateEnd}
            onRequestEdit={onRequestEdit}
          />
        ))}
      </View>
    </View>
  );
}

// ─── TextEditorModal ──────────────────────────────────────────────────────────

interface TextEditorModalProps {
  item: PlacedItem;
  onChange: (patch: Partial<Pick<PlacedItem, 'text' | 'fontKey' | 'color'>>) => void;
  onClose: () => void;
}

function TextEditorModal({ item, onChange, onClose }: TextEditorModalProps) {
  const [text, setText] = useState(item.text ?? '');
  const fontKey = item.fontKey ?? JOURNAL_FONTS[0].key;
  const color = item.color ?? theme.palette.charcoal;

  return (
    <View style={styles.textModalScrim}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.textModalCard}>
        <Text style={styles.textModalTitle}>Write something</Text>

        <TextInput
          style={[styles.textModalInput, { fontFamily: familyForFontKey(fontKey), color }]}
          value={text}
          onChangeText={(t) => {
            setText(t);
            onChange({ text: t });
          }}
          placeholder="Type your words…"
          placeholderTextColor={theme.color.fg4}
          multiline
          autoFocus
        />

        {/* Font picker */}
        <Text style={styles.textModalLabel}>FONT</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fontRow}>
          {JOURNAL_FONTS.map((f) => {
            const active = f.key === fontKey;
            return (
              <Pressable
                key={f.key}
                style={[styles.fontChip, active && styles.fontChipActive]}
                onPress={() => onChange({ fontKey: f.key })}
              >
                <Text style={[styles.fontChipSample, { fontFamily: f.family }]} numberOfLines={1}>
                  Ag
                </Text>
                <Text style={[styles.fontChipLabel, active && styles.fontChipLabelActive]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Colour picker */}
        <Text style={styles.textModalLabel}>COLOUR</Text>
        <View style={styles.colorRow}>
          {TEXT_COLORS.map((c) => {
            const active = c === color;
            return (
              <Pressable
                key={c}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c },
                  c === theme.palette.cream && styles.colorSwatchLight,
                  active && styles.colorSwatchActive,
                ]}
                onPress={() => onChange({ color: c })}
              />
            );
          })}
        </View>

        <View style={styles.textModalActions}>
          <Button title="Done" onPress={onClose} />
        </View>
      </View>
    </View>
  );
}

// ─── DoodleCanvas ─────────────────────────────────────────────────────────────

/**
 * Full-canvas capture layer while the pen tool is active. Points arrive in
 * container (zoomed) coordinates and are divided by spreadScale on commit so
 * strokes land in spread coordinates regardless of zoom.
 */
function DoodleCanvas({
  spreadScale,
  color,
  onStroke,
}: {
  spreadScale: number;
  color: string;
  onStroke: (points: { x: number; y: number }[]) => void;
}) {
  const [livePoints, setLivePoints] = useState<{ x: number; y: number }[]>([]);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);

  const addPoint = (x: number, y: number) => {
    pointsRef.current = [...pointsRef.current, { x, y }];
    setLivePoints(pointsRef.current);
  };

  const commit = () => {
    const pts = pointsRef.current;
    pointsRef.current = [];
    setLivePoints([]);
    if (pts.length > 1) {
      onStroke(pts.map((p) => ({ x: p.x / spreadScale, y: p.y / spreadScale })));
    }
  };

  const pan = Gesture.Pan()
    .minDistance(0)
    .runOnJS(true)
    .onBegin((e) => {
      pointsRef.current = [{ x: e.x, y: e.y }];
      setLivePoints(pointsRef.current);
    })
    .onUpdate((e) => {
      addPoint(e.x, e.y);
    })
    .onEnd(() => {
      commit();
    })
    .onFinalize(() => {
      commit();
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={StyleSheet.absoluteFill}>
        {livePoints.length > 1 && (
          <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            <Polyline
              points={livePoints.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke={color}
              strokeWidth={DOODLE_STROKE * spreadScale}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </View>
    </GestureDetector>
  );
}

// ─── DeliveryOverlay ──────────────────────────────────────────────────────────

/**
 * The "your order has arrived" ritual: a parcel pops in, shakes, then bursts
 * open as the purchased pieces drift up — before the editor zooms the buyer to
 * the item drawer. Reuses the spread's reanimated stack.
 */
function DeliveryOverlay({ items, onDone }: { items: ShopItem[]; onDone: () => void }) {
  const scrim = useSharedValue(0);
  const boxScale = useSharedValue(0.6);
  const boxRot = useSharedValue(0);
  const boxOpacity = useSharedValue(0);
  const reveal = useSharedValue(0);
  const done = useRef(false);

  function finish() {
    if (done.current) return;
    done.current = true;
    onDone();
  }

  useEffect(() => {
    scrim.value = withTiming(1, { duration: 280 });
    boxOpacity.value = withTiming(1, { duration: 280 });
    boxScale.value = withTiming(1, { duration: 360, easing: FLIP_EASING });
    // Shake the parcel after it pops in.
    boxRot.value = withDelay(
      420,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 90 }),
          withTiming(5, { duration: 90 }),
        ),
        6,
        true,
      ),
    );
    // Burst open: the box lifts away as the contents drift up.
    const tOpen = setTimeout(() => {
      boxScale.value = withTiming(1.5, { duration: 440, easing: FLIP_EASING });
      boxOpacity.value = withTiming(0, { duration: 440 });
      reveal.value = withTiming(1, { duration: 520, easing: FLIP_EASING });
    }, 1600);
    // Zoom on to the drawer.
    const tDone = setTimeout(finish, 3300);
    return () => {
      clearTimeout(tOpen);
      clearTimeout(tDone);
    };
  }, []);

  const scrimStyle = useAnimatedStyle(() => ({ opacity: scrim.value }));
  const boxStyle = useAnimatedStyle(() => ({
    opacity: boxOpacity.value,
    transform: [{ scale: boxScale.value }, { rotate: `${boxRot.value}deg` }],
  }));
  const revealStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [{ translateY: (1 - reveal.value) * 28 }],
  }));

  return (
    <Pressable style={styles.deliveryScrimWrap} onPress={finish}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.deliveryBackdrop, scrimStyle]} />

      {/* Revealed contents */}
      <Animated.View style={[styles.deliveryReveal, revealStyle]} pointerEvents="none">
        <Text style={styles.deliveryEyebrow}>YOUR ORDER HAS ARRIVED</Text>
        <Text style={styles.deliveryTitle}>
          {items.length === 1 ? items[0].name : `${items.length} new pieces`}
        </Text>
        <View style={styles.deliveryItemRow}>
          {items.slice(0, 4).map((it) => {
            const tone = SHOP_TONES[it.tone as keyof typeof SHOP_TONES] ?? SHOP_TONES.sage;
            return (
              <View key={it.id} style={styles.deliveryTile}>
                <View
                  style={[
                    styles.deliveryTileArt,
                    { backgroundColor: it.flowerAsset ? theme.palette.cream : tone.bg },
                  ]}
                >
                  {it.flowerAsset ? (
                    <Image source={it.flowerAsset as any} style={styles.deliveryTileImg} resizeMode="contain" />
                  ) : (
                    <Feather name={it.glyph as any} size={30} color={tone.accent} />
                  )}
                </View>
                <Text style={styles.deliveryTileLabel} numberOfLines={1}>{it.name}</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.deliverySub}>Added to your collection — nothing ever expires.</Text>
      </Animated.View>

      {/* The parcel */}
      <Animated.View style={[styles.deliveryBox, boxStyle]} pointerEvents="none">
        <View style={styles.deliveryBoxLid} />
        <View style={styles.deliveryBoxStringV} />
        <View style={styles.deliveryBoxStringH} />
        <View style={styles.deliveryBoxStamp}>
          <Text style={styles.deliveryBoxStampText}>P&P</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── Main EditorScreen ────────────────────────────────────────────────────────

export default function EditorScreen() {
  const router = useRouter();
  const { id: journalId } = useLocalSearchParams<{ id: string }>();
  const journal = useAppStore((s) => s.journals.find((j) => j.id === journalId));
  const renameJournal = useAppStore((s) => s.renameJournal);
  const shopItems = useAppStore((s) => s.shopItems);
  const setShopItems = useAppStore((s) => s.setShopItems);
  const pendingDelivery = useAppStore((s) => s.pendingDelivery);
  const clearPendingDelivery = useAppStore((s) => s.clearPendingDelivery);
  const noteRecentItem = useAppStore((s) => s.noteRecentItem);

  const { width: screenW, height: screenH } = useWindowDimensions();

  useEffect(() => {
    screen('Editor', { journalId });
  }, [journalId]);

  // Refresh live Sanity items on mount (same as shop screen)
  useEffect(() => {
    fetchLiveItems().then((results) => {
      if (results.length > 0) setShopItems(results.map(sanityItemToShopItem));
    });
  }, []);

  // ── Core state ───────────────────────────────────────────────────────────
  const [pages, setPages] = useState<PageState[]>(() =>
    Array.from({ length: 8 }, () => ({ items: [] })),
  );
  const [activePage, setActivePage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCat, setDrawerCat] = useState('papers');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [clipboard, setClipboard] = useState<PlacedItem | null>(null);
  const [textEditorId, setTextEditorId] = useState<string | null>(null);
  const [penMode, setPenMode] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const tapeToneIdx = useRef(0);
  const spreadShotRef = useRef<View>(null);
  const [history, setHistory] = useState<PageState[][]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [journalName, setJournalName] = useState(journal?.name ?? 'My Journal');
  const [editingName, setEditingName] = useState(false);

  // ── Layout ────────────────────────────────────────────────────────────────
  const canvasW = screenW - 80;
  const canvasH = screenH - 64;
  const baseScale = Math.min(canvasW / SPREAD_W, canvasH / SPREAD_H) * 0.9;
  const spreadScale = baseScale * zoom;

  // ── Page flip animation ───────────────────────────────────────────────────
  const [flipState, setFlipState] = useState<FlipState | null>(null);
  const flipRot = useSharedValue(0);

  // ── Drawer animation ──────────────────────────────────────────────────────
  const drawerX = useSharedValue(360);
  const drawerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drawerX.value }],
  }));

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
    drawerX.value = withTiming(open ? 0 : 360, { duration: 320, easing: Easing.bezier(0.32, 0.72, 0.32, 1) });
  };

  // ── Save timeout ──────────────────────────────────────────────────────────
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleSave(pgs: PageState[]) {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      supabase
        .from('spreads')
        .upsert(
          pgs.map((pg, i) => ({
            journal_id: journalId,
            page_number: i + 1,
            scene: { items: pg.items },
            updated_at: new Date().toISOString(),
          })),
        )
        .then(({ error }) => {
          if (error) console.warn('Save error', error);
        });
    }, 1200);
  }

  // ── History helpers ───────────────────────────────────────────────────────
  function pushHistory(newPages: PageState[]) {
    setHistory((prevHistory) => {
      const trimmed = prevHistory.slice(0, historyIdx + 1);
      const next = [...trimmed, newPages].slice(-60);
      setHistoryIdx(next.length - 1);
      return next;
    });
    setPages(newPages);
  }

  function undo() {
    if (historyIdx <= 0) return;
    const idx = historyIdx - 1;
    setHistoryIdx(idx);
    setPages(history[idx]);
  }

  function redo() {
    if (historyIdx >= history.length - 1) return;
    const idx = historyIdx + 1;
    setHistoryIdx(idx);
    setPages(history[idx]);
  }

  // ── Item placement ────────────────────────────────────────────────────────
  function placeItem(shopItem: { id: string; glyph: string; tone: string; flowerAsset?: number | { uri: string } }) {
    const currentItems = pages[activePage - 1].items;
    const maxZ = currentItems.reduce((m, i) => Math.max(m, i.z), 0);

    const newItem: PlacedItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      itemId: shopItem.id,
      glyph: shopItem.glyph,
      tone: shopItem.tone,
      flowerAsset: shopItem.flowerAsset,
      x: PAGE_W * 0.7 + (Math.random() - 0.5) * PAGE_W * 0.4,
      y: SPREAD_H * 0.3 + Math.random() * SPREAD_H * 0.4,
      w: DEFAULT_ITEM_SIZE,
      h: DEFAULT_ITEM_SIZE,
      rotate: (Math.random() - 0.5) * 20,
      z: maxZ + 1,
    };

    const newPages = pages.map((p, i) =>
      i === activePage - 1 ? { ...p, items: [...p.items, newItem] } : p,
    );
    pushHistory(newPages);
    scheduleSave(newPages);
    setSelectedId(newItem.id);
    noteRecentItem(shopItem.id);
    toggleDrawer(false);
    track('item_placed', { category: drawerCat });
  }

  // ── Item handlers ─────────────────────────────────────────────────────────
  function handleMoveEnd(id: string, x: number, y: number) {
    const newPages = pages.map((p, i) =>
      i === activePage - 1
        ? { ...p, items: p.items.map((it) => (it.id === id ? { ...it, x, y } : it)) }
        : p,
    );
    pushHistory(newPages);
    scheduleSave(newPages);
  }

  function handleResizeEnd(id: string, w: number, h: number) {
    const newPages = pages.map((p, i) =>
      i === activePage - 1
        ? { ...p, items: p.items.map((it) => (it.id === id ? { ...it, w, h } : it)) }
        : p,
    );
    pushHistory(newPages);
    scheduleSave(newPages);
  }

  function handleRotateEnd(id: string, rotate: number) {
    const newPages = pages.map((p, i) =>
      i === activePage - 1
        ? { ...p, items: p.items.map((it) => (it.id === id ? { ...it, rotate } : it)) }
        : p,
    );
    pushHistory(newPages);
    scheduleSave(newPages);
  }

  function handleBringForward(id: string) {
    const pageItems = pages[activePage - 1].items;
    const item = pageItems.find((it) => it.id === id);
    if (!item) return;
    const above = pageItems.filter((it) => it.z > item.z).sort((a, b) => a.z - b.z)[0];
    if (!above) return;
    const newPages = pages.map((p, i) =>
      i === activePage - 1
        ? {
            ...p,
            items: p.items.map((it) =>
              it.id === id ? { ...it, z: above.z } : it.id === above.id ? { ...it, z: item.z } : it,
            ),
          }
        : p,
    );
    pushHistory(newPages);
  }

  function handleSendBack(id: string) {
    const pageItems = pages[activePage - 1].items;
    const item = pageItems.find((it) => it.id === id);
    if (!item) return;
    const below = pageItems.filter((it) => it.z < item.z).sort((a, b) => b.z - a.z)[0];
    if (!below) return;
    const newPages = pages.map((p, i) =>
      i === activePage - 1
        ? {
            ...p,
            items: p.items.map((it) =>
              it.id === id ? { ...it, z: below.z } : it.id === below.id ? { ...it, z: item.z } : it,
            ),
          }
        : p,
    );
    pushHistory(newPages);
  }

  function handleDeleteSelected() {
    if (!selectedId) return;
    const newPages = pages.map((p, i) =>
      i === activePage - 1 ? { ...p, items: p.items.filter((it) => it.id !== selectedId) } : p,
    );
    setSelectedId(null);
    pushHistory(newPages);
    scheduleSave(newPages);
  }

  // ── Copy / paste ──────────────────────────────────────────────────────────
  function copySelected() {
    const item = pages[activePage - 1]?.items.find((it) => it.id === selectedId);
    if (item) setClipboard(item);
  }

  function pasteClipboard() {
    if (!clipboard) return;
    const currentItems = pages[activePage - 1]?.items ?? [];
    const maxZ = currentItems.reduce((m, i) => Math.max(m, i.z), 0);
    const pasted: PlacedItem = {
      ...clipboard,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      x: Math.min(clipboard.x + 24, SPREAD_W - MIN_VIS),
      y: Math.min(clipboard.y + 24, SPREAD_H - MIN_VIS),
      z: maxZ + 1,
    };
    const newPages = pages.map((p, i) =>
      i === activePage - 1 ? { ...p, items: [...p.items, pasted] } : p,
    );
    pushHistory(newPages);
    scheduleSave(newPages);
    setSelectedId(pasted.id);
  }

  // Keyboard shortcuts (web only)
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      if (e.key === 'c') { e.preventDefault(); copySelected(); }
      if (e.key === 'v') { e.preventDefault(); pasteClipboard(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, clipboard, pages, activePage]);

  // ── Text tool ─────────────────────────────────────────────────────────────
  function addText() {
    const currentItems = pages[activePage - 1].items;
    const maxZ = currentItems.reduce((m, i) => Math.max(m, i.z), 0);
    const newItem: PlacedItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      itemId: 'text',
      kind: 'text',
      glyph: 'type',
      tone: 'sage',
      text: '',
      fontKey: JOURNAL_FONTS[0].key,
      color: theme.palette.charcoal,
      x: PAGE_W * 0.7 + (Math.random() - 0.5) * PAGE_W * 0.3,
      y: SPREAD_H * 0.4 + Math.random() * SPREAD_H * 0.2,
      w: NEW_TEXT_W,
      h: NEW_TEXT_H,
      rotate: (Math.random() - 0.5) * 8,
      z: maxZ + 1,
    };
    const newPages = pages.map((p, i) =>
      i === activePage - 1 ? { ...p, items: [...p.items, newItem] } : p,
    );
    pushHistory(newPages);
    setSelectedId(newItem.id);
    setTextEditorId(newItem.id);
    track('text_added');
  }

  function updateTextItem(id: string, patch: Partial<Pick<PlacedItem, 'text' | 'fontKey' | 'color'>>) {
    const newPages = pages.map((p, i) =>
      i === activePage - 1
        ? { ...p, items: p.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }
        : p,
    );
    pushHistory(newPages);
    scheduleSave(newPages);
  }

  function closeTextEditor() {
    // Drop a text item that was never given any words.
    const item = pages[activePage - 1]?.items.find((it) => it.id === textEditorId);
    if (item && item.kind === 'text' && !(item.text ?? '').trim()) {
      const newPages = pages.map((p, i) =>
        i === activePage - 1 ? { ...p, items: p.items.filter((it) => it.id !== textEditorId) } : p,
      );
      setSelectedId(null);
      setPages(newPages);
    }
    setTextEditorId(null);
  }

  // ── Washi tape ────────────────────────────────────────────────────────────
  function addTape() {
    const currentItems = pages[activePage - 1].items;
    const maxZ = currentItems.reduce((m, i) => Math.max(m, i.z), 0);
    const tone = TAPE_TONES[tapeToneIdx.current % TAPE_TONES.length];
    tapeToneIdx.current += 1;
    const newItem: PlacedItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      itemId: 'tape',
      kind: 'tape',
      glyph: 'minus',
      tone,
      x: PAGE_W * 0.7 + (Math.random() - 0.5) * PAGE_W * 0.3,
      y: SPREAD_H * 0.4 + Math.random() * SPREAD_H * 0.2,
      w: TAPE_W,
      h: TAPE_H,
      rotate: (Math.random() - 0.5) * 30,
      z: maxZ + 1,
    };
    const newPages = pages.map((p, i) =>
      i === activePage - 1 ? { ...p, items: [...p.items, newItem] } : p,
    );
    pushHistory(newPages);
    scheduleSave(newPages);
    setSelectedId(newItem.id);
    track('tape_added');
  }

  // ── Doodle pen ────────────────────────────────────────────────────────────
  function addDoodle(points: { x: number; y: number }[]) {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const pad = DOODLE_STROKE;
    const minX = Math.min(...xs) - pad;
    const minY = Math.min(...ys) - pad;
    const maxX = Math.max(...xs) + pad;
    const maxY = Math.max(...ys) + pad;
    const w = Math.max(DOODLE_MIN_BOX, maxX - minX);
    const h = Math.max(DOODLE_MIN_BOX, maxY - minY);
    const currentItems = pages[activePage - 1].items;
    const maxZ = currentItems.reduce((m, i) => Math.max(m, i.z), 0);
    const newItem: PlacedItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      itemId: 'doodle',
      kind: 'doodle',
      glyph: 'edit-3',
      tone: 'sage',
      color: theme.palette.charcoal,
      points: points.map((p) => ({ x: p.x - minX, y: p.y - minY })),
      srcW: w,
      srcH: h,
      x: minX + w / 2,
      y: minY + h / 2,
      w,
      h,
      rotate: 0,
      z: maxZ + 1,
    };
    const newPages = pages.map((p, i) =>
      i === activePage - 1 ? { ...p, items: [...p.items, newItem] } : p,
    );
    pushHistory(newPages);
    scheduleSave(newPages);
    track('doodle_added');
  }

  // ── Templates ─────────────────────────────────────────────────────────────
  function applyTemplate(tpl: JournalTemplate) {
    const baseZ = pages[activePage - 1].items.reduce((m, i) => Math.max(m, i.z), 0);
    const stamp = Date.now();
    const newItems: PlacedItem[] = tpl.items.map((t, idx) => ({
      id: `${stamp}-${idx}-${Math.random().toString(36).slice(2)}`,
      itemId: t.kind ?? 'item',
      kind: t.kind ?? 'item',
      glyph: t.glyph ?? 'square',
      tone: t.tone ?? 'sage',
      text: t.text,
      fontKey: t.fontKey,
      color: t.color,
      shadow: t.shadow,
      x: t.x,
      y: t.y,
      w: t.w,
      h: t.h,
      rotate: t.rotate ?? 0,
      z: baseZ + 1 + idx,
    }));
    const newPages = pages.map((p, i) =>
      i === activePage - 1 ? { ...p, items: [...p.items, ...newItems] } : p,
    );
    pushHistory(newPages);
    scheduleSave(newPages);
    setTemplatePickerOpen(false);
    setSelectedId(null);
    track('template_applied', { templateId: tpl.id });
  }

  // ── Export & share ────────────────────────────────────────────────────────
  async function exportSpread() {
    if (exporting) return;
    setExporting(true);
    // Hide selection chrome before the snapshot.
    setSelectedId(null);
    setLayerPanelOpen(false);
    await new Promise((r) => setTimeout(r, 120));
    try {
      const uri = await captureRef(spreadShotRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
        width: SPREAD_W * 2,
        height: SPREAD_H * 2,
      });
      if (Platform.OS === 'web') {
        const a = document.createElement('a');
        a.href = uri;
        a.download = `${(journal?.name ?? 'journal').replace(/\s+/g, '-').toLowerCase()}-page-${activePage}.png`;
        a.click();
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share your spread',
        });
      }
      track('spread_exported', { journalId, page: activePage });
    } catch (e) {
      Alert.alert('Export failed', 'We couldn’t capture this page — please try again.');
    } finally {
      setExporting(false);
    }
  }

  // ── Shadow toggle ─────────────────────────────────────────────────────────
  function handleToggleShadow(id: string) {
    const newPages = pages.map((p, i) =>
      i === activePage - 1
        ? { ...p, items: p.items.map((it) => (it.id === id ? { ...it, shadow: !it.shadow } : it)) }
        : p,
    );
    pushHistory(newPages);
    scheduleSave(newPages);
  }

  // ── Photo import ──────────────────────────────────────────────────────────
  async function addPhoto() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Photos access needed', 'Allow photo access in Settings to add your own pictures.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.9,
      });
      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];
      const aspect = asset.width && asset.height ? asset.width / asset.height : 1;
      const h = 180;
      const w = Math.max(MIN_ITEM_SIZE, Math.min(MAX_ITEM_SIZE, h * aspect));
      const currentItems = pages[activePage - 1].items;
      const maxZ = currentItems.reduce((m, i) => Math.max(m, i.z), 0);
      const newItem: PlacedItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        itemId: 'photo',
        kind: 'photo',
        glyph: 'image',
        tone: 'cream',
        flowerAsset: { uri: asset.uri },
        x: PAGE_W * 0.7 + (Math.random() - 0.5) * PAGE_W * 0.3,
        y: SPREAD_H * 0.4 + Math.random() * SPREAD_H * 0.2,
        w,
        h,
        rotate: (Math.random() - 0.5) * 8,
        z: maxZ + 1,
      };
      const newPages = pages.map((p, i) =>
        i === activePage - 1 ? { ...p, items: [...p.items, newItem] } : p,
      );
      pushHistory(newPages);
      scheduleSave(newPages);
      setSelectedId(newItem.id);
      track('photo_added');
    } catch (e) {
      Alert.alert('Could not add photo', 'Something went wrong picking that image.');
    }
  }

  // ── Page navigation ───────────────────────────────────────────────────────
  function finishFlip(to: number) {
    setActivePage(to);
    setFlipState(null);
  }

  function startFlipPhaseB(dir: 'next' | 'prev', from: number, to: number) {
    // Past 90° the turning page shows its back: the destination page landing.
    setActivePage(to);
    setFlipState({ dir, from, to, phase: 'B' });
    flipRot.value = dir === 'next' ? 90 : -90;
    flipRot.value = withTiming(0, { duration: FLIP_DURATION, easing: FLIP_EASING }, (finished) => {
      if (finished) runOnJS(finishFlip)(to);
    });
  }

  function goToPage(newPage: number, pageCount = pages.length) {
    if (newPage < 1 || newPage > pageCount || newPage === activePage || flipState) return;
    setSelectedId(null);
    const dir: 'next' | 'prev' = newPage > activePage ? 'next' : 'prev';
    const from = activePage;
    const to = newPage;
    setFlipState({ dir, from, to, phase: 'A' });
    flipRot.value = 0;
    flipRot.value = withTiming(
      dir === 'next' ? -90 : 90,
      { duration: FLIP_DURATION, easing: FLIP_EASING },
      (finished) => {
        if (finished) runOnJS(startFlipPhaseB)(dir, from, to);
        else runOnJS(finishFlip)(to);
      },
    );
  }

  function addPage() {
    if (pages.length >= MAX_PAGES) return;
    const newPages = [...pages, { items: [] }];
    pushHistory(newPages);
    scheduleSave(newPages);
    goToPage(newPages.length, newPages.length);
    track('page_added');
  }

  async function handleDeletePage() {
    const isCover = activePage === 1 || activePage === pages.length;
    const contentPages = pages.length - 2; // first & last spreads carry the covers
    if (isCover || contentPages <= 1) return;
    const ok = await confirmAsync('Delete this page?', 'Items on it will be removed.');
    if (!ok) return;
    const newPages = pages.filter((_, i) => i !== activePage - 1);
    setSelectedId(null);
    setActivePage(Math.min(activePage, newPages.length));
    pushHistory(newPages);
    scheduleSave(newPages);
  }

  // ── Name editing ──────────────────────────────────────────────────────────
  function commitName() {
    setEditingName(false);
    const name = journalName.trim();
    if (name && journal) renameJournal(journal.id, name);
    else setJournalName(journal?.name ?? 'My Journal');
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentPageItems = pages[activePage - 1]?.items ?? [];
  const selectedItem = selectedId ? currentPageItems.find((it) => it.id === selectedId) : null;
  const editingTextItem = textEditorId ? currentPageItems.find((it) => it.id === textEditorId) : null;
  const canUndo = historyIdx > 0;
  const canRedo = historyIdx < history.length - 1;
  const isPhone = screenW < theme.layout.phoneBreakpoint;
  const isCoverSpread = activePage === 1 || activePage === pages.length;
  const canDeletePage = !isCoverSpread && pages.length - 2 > 1;

  // Wrapper sized to the ZOOMED spread so the surrounding ScrollViews know the
  // real content size; the spread is laid out at full size and scaled in place
  // around its center, which exactly fills this box.
  const containerW = SPREAD_W * spreadScale;
  const containerH = SPREAD_H * spreadScale;

  // Toolbar position in (unscaled) container coords, from item spread coords.
  const toolbarLeft = selectedItem
    ? containerW / 2 + (selectedItem.x - SPREAD_W / 2) * spreadScale - 56
    : 0;
  const toolbarTop = selectedItem
    ? containerH / 2 + (selectedItem.y - selectedItem.h / 2 - SPREAD_H / 2) * spreadScale - 56
    : 0;

  const flipSide: 'left' | 'right' = flipState
    ? (flipState.dir === 'next') === (flipState.phase === 'A')
      ? 'right'
      : 'left'
    : 'right';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Screen texture={false} style={styles.root}>
        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <View style={styles.topbar}>
          <Pressable style={styles.iconBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color={theme.color.fg1} />
          </Pressable>

          {editingName ? (
            <TextInput
              style={styles.nameInput}
              value={journalName}
              onChangeText={setJournalName}
              onBlur={commitName}
              onSubmitEditing={commitName}
              autoFocus
            />
          ) : (
            <Pressable style={styles.nameWrap} onPress={() => setEditingName(true)}>
              <Text style={styles.name} numberOfLines={1}>
                {journal?.name ?? journalName}
              </Text>
              <Feather name="edit-2" size={14} color={theme.color.fg3} />
            </Pressable>
          )}

          <View style={styles.topRight}>
            {/* Undo */}
            <Pressable
              style={[styles.iconBtn, !canUndo && styles.dimmed]}
              onPress={undo}
              disabled={!canUndo}
            >
              <Feather name="rotate-ccw" size={18} color={canUndo ? theme.color.fg1 : theme.color.fg3} />
            </Pressable>
            {/* Redo */}
            <Pressable
              style={[styles.iconBtn, !canRedo && styles.dimmed]}
              onPress={redo}
              disabled={!canRedo}
            >
              <Feather name="rotate-cw" size={18} color={canRedo ? theme.color.fg1 : theme.color.fg3} />
            </Pressable>
            {/* Copy */}
            <Pressable
              style={[styles.iconBtn, !selectedId && styles.dimmed]}
              onPress={copySelected}
              disabled={!selectedId}
            >
              <Feather name="copy" size={18} color={selectedId ? theme.color.fg1 : theme.color.fg3} />
            </Pressable>
            {/* Paste */}
            <Pressable
              style={[styles.iconBtn, !clipboard && styles.dimmed]}
              onPress={pasteClipboard}
              disabled={!clipboard}
            >
              <Feather name="clipboard" size={18} color={clipboard ? theme.color.fg1 : theme.color.fg3} />
            </Pressable>
            {/* Zoom out */}
            <Pressable
              style={[styles.iconBtn, zoom <= 0.5 && styles.dimmed]}
              onPress={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              disabled={zoom <= 0.5}
            >
              <Feather name="zoom-out" size={18} color={theme.color.fg1} />
            </Pressable>
            {/* Zoom indicator */}
            <View style={styles.zoomBadge}>
              <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
            </View>
            {/* Zoom in */}
            <Pressable
              style={[styles.iconBtn, zoom >= 2.0 && styles.dimmed]}
              onPress={() => setZoom((z) => Math.min(2.0, z + 0.1))}
              disabled={zoom >= 2.0}
            >
              <Feather name="zoom-in" size={18} color={theme.color.fg1} />
            </Pressable>
            {/* Layer count */}
            <Pressable
              style={[styles.layersBtn, layerPanelOpen && styles.layersBtnActive]}
              onPress={() => setLayerPanelOpen((o) => !o)}
            >
              <Feather name="layers" size={16} color={theme.color.fg1} />
              <Text style={styles.layersText}>{currentPageItems.length}</Text>
            </Pressable>
            {/* Share / export */}
            <Pressable
              style={[styles.iconBtn, exporting && styles.dimmed]}
              onPress={exportSpread}
              disabled={exporting}
            >
              <Feather name="share" size={18} color={theme.color.fg1} />
            </Pressable>
          </View>
        </View>

        <View style={styles.body}>
          {/* ── Page strip ───────────────────────────────────────────── */}
          <View style={styles.strip}>
            <ScrollView contentContainerStyle={styles.stripScroll}>
              {pages.map((_, i) => {
                const p = i + 1;
                return (
                  <Pressable
                    key={p}
                    style={[styles.thumb, p === activePage && styles.thumbActive]}
                    onPress={() => goToPage(p)}
                  >
                    <Text style={[styles.thumbNum, p === activePage && styles.thumbNumActive]}>
                      {p}
                    </Text>
                    {(p === 1 || p === pages.length) && (
                      <Text style={[styles.thumbTag, p === activePage && styles.thumbNumActive]}>
                        {p === 1 ? 'FIRST' : 'LAST'}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
              <Pressable
                style={[styles.thumbAdd, pages.length >= MAX_PAGES && styles.dimmed]}
                onPress={addPage}
                disabled={pages.length >= MAX_PAGES}
              >
                <Feather name="plus" size={18} color={theme.color.fg2} />
                <Text style={styles.thumbCount}>
                  {pages.length}/{MAX_PAGES}
                </Text>
              </Pressable>
            </ScrollView>
          </View>

          {/* ── Canvas ───────────────────────────────────────────────── */}
          <View style={styles.canvasArea}>
            {/* Nested ScrollViews: vertical outer + horizontal inner, so the
                zoomed spread can be scrolled with wheel/scrollbars on web and
                never paints over the page strip, top bar, or toolbar (the
                canvas area clips). The spread centers itself when it is
                smaller than the viewport (flexGrow + center). */}
            <ScrollView
              style={styles.canvasScroll}
              contentContainerStyle={styles.canvasScrollVContent}
            >
              <ScrollView
                horizontal
                contentContainerStyle={styles.canvasScrollHContent}
              >
                <View style={[styles.spreadContainer, { width: containerW, height: containerH }]}>
                  {/* The spread, laid out at full size and scaled in place around
                      its center — exactly filling the zoom-sized wrapper. */}
                  <View
                    ref={spreadShotRef}
                    collapsable={false}
                    style={[
                      styles.spreadScaled,
                      { width: SPREAD_W, height: SPREAD_H, transform: [{ scale: spreadScale }] },
                    ]}
                  >
                    {flipState ? (
                      <View style={styles.flipStage}>
                        {/* Static base: the side being revealed already shows the
                            destination spread; the other keeps the current one. */}
                        <View style={styles.spreadInner}>
                          <SpreadHalf
                            pages={pages}
                            page={flipState.dir === 'next' ? flipState.from : flipState.to}
                            side="left"
                          />
                          <SpreadHalf
                            pages={pages}
                            page={flipState.dir === 'next' ? flipState.to : flipState.from}
                            side="right"
                          />
                        </View>
                        {/* The turning page, hinged at the spine */}
                        <FlipPage side={flipSide} rot={flipRot}>
                          <SpreadHalf
                            pages={pages}
                            page={flipState.phase === 'A' ? flipState.from : flipState.to}
                            side={flipSide}
                          />
                        </FlipPage>
                      </View>
                    ) : (
                      <SpreadView
                        pages={pages}
                        activePage={activePage}
                        selectedId={selectedId}
                        spreadScale={spreadScale}
                        onCanvasTap={() => setSelectedId(null)}
                        onSelect={setSelectedId}
                        onMoveEnd={handleMoveEnd}
                        onResizeEnd={handleResizeEnd}
                        onRotateEnd={handleRotateEnd}
                        onRequestEdit={(id) => { setSelectedId(id); setTextEditorId(id); }}
                      />
                    )}
                  </View>

                  {/* Doodle capture layer — container coords, converted to spread
                      coords on commit. Sits above items while the pen is active. */}
                  {penMode && !flipState && (
                    <View style={[StyleSheet.absoluteFill, styles.penLayer]}>
                      <DoodleCanvas
                        spreadScale={spreadScale}
                        color={theme.palette.charcoal}
                        onStroke={addDoodle}
                      />
                    </View>
                  )}

                  {/* Item toolbar — OUTSIDE the scaled spread (canvas coords) so it
                      keeps its size at any zoom and stays clickable on top. */}
                  {selectedItem && !flipState && (
                    <View style={styles.toolbarLayer} pointerEvents="box-none">
                      <ItemToolbar
                        left={toolbarLeft}
                        top={toolbarTop}
                        onBringForward={() => handleBringForward(selectedItem.id)}
                        onSendBack={() => handleSendBack(selectedItem.id)}
                        onDelete={handleDeleteSelected}
                        onEditText={
                          selectedItem.kind === 'text'
                            ? () => setTextEditorId(selectedItem.id)
                            : undefined
                        }
                        onToggleShadow={
                          selectedItem.kind !== 'text' && selectedItem.kind !== 'doodle'
                            ? () => handleToggleShadow(selectedItem.id)
                            : undefined
                        }
                        shadowOn={!!selectedItem.shadow}
                      />
                    </View>
                  )}
                </View>
              </ScrollView>
            </ScrollView>

            {/* Page nav affordances */}
            <Pressable
              style={[styles.pageNav, { left: 8 }, activePage <= 1 && styles.hidden]}
              onPress={() => goToPage(activePage - 1)}
            >
              <Feather name="chevron-left" size={24} color={theme.color.fg2} />
            </Pressable>
            <Pressable
              style={[styles.pageNav, { right: 8 }, activePage >= pages.length && styles.hidden]}
              onPress={() => goToPage(activePage + 1)}
            >
              <Feather name="chevron-right" size={24} color={theme.color.fg2} />
            </Pressable>

            {/* Floating add button */}
            <Pressable style={styles.fab} onPress={() => toggleDrawer(true)}>
              <Feather name="plus" size={26} color={theme.palette.cream} />
            </Pressable>

            {/* Add text */}
            <Pressable style={[styles.miniFab, { top: 84 }]} onPress={addText}>
              <Feather name="type" size={20} color={theme.palette.forest} />
            </Pressable>

            {/* Add photo */}
            <Pressable style={[styles.miniFab, { top: 134 }]} onPress={addPhoto}>
              <Feather name="image" size={20} color={theme.palette.forest} />
            </Pressable>

            {/* Washi tape */}
            <Pressable style={[styles.miniFab, { top: 184 }]} onPress={addTape}>
              <Feather name="minus" size={20} color={theme.palette.forest} />
            </Pressable>

            {/* Doodle pen — toggles draw mode */}
            <Pressable
              style={[styles.miniFab, { top: 234 }, penMode && styles.miniFabActive]}
              onPress={() => { setPenMode((m) => !m); setSelectedId(null); }}
            >
              <Feather name="edit-3" size={20} color={penMode ? theme.palette.cream : theme.palette.forest} />
            </Pressable>

            {/* Starter templates */}
            <Pressable style={[styles.miniFab, { top: 284 }]} onPress={() => setTemplatePickerOpen(true)}>
              <Feather name="grid" size={20} color={theme.palette.forest} />
            </Pressable>

            {/* Pen-mode hint */}
            {penMode && (
              <View style={styles.penHint} pointerEvents="none">
                <Text style={styles.penHintText}>Draw on the page · tap the pen again to finish</Text>
              </View>
            )}

            {/* Delete page — quiet affordance at the canvas bottom */}
            {!isCoverSpread && (
              <Pressable
                style={[styles.deletePageBtn, !canDeletePage && styles.dimmed]}
                onPress={handleDeletePage}
                disabled={!canDeletePage}
              >
                <Feather
                  name="trash-2"
                  size={13}
                  color={canDeletePage ? theme.palette.danger : theme.color.fg4}
                />
                <Text
                  style={[styles.deletePageText, canDeletePage && { color: theme.palette.danger }]}
                >
                  Delete page
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* ── Layers panel ──────────────────────────────────────────── */}
        {layerPanelOpen && (
          <>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setLayerPanelOpen(false)} />
            <View style={styles.layerPanel}>
              <View style={styles.layerPanelHeader}>
                <Text style={styles.layerPanelTitle}>Layers</Text>
                <Pressable onPress={() => setLayerPanelOpen(false)} hitSlop={8}>
                  <Feather name="x" size={16} color={theme.color.fg2} />
                </Pressable>
              </View>
              <ScrollView>
                {[...currentPageItems].sort((a, b) => b.z - a.z).map((item, idx, arr) => {
                  const toneKey = item.tone as keyof typeof SHOP_TONES;
                  const tone = SHOP_TONES[toneKey] ?? SHOP_TONES.sage;
                  const isSelected = item.id === selectedId;
                  const itemName =
                    item.kind === 'text'
                      ? (item.text || 'Text').trim() || 'Text'
                      : item.kind === 'photo'
                        ? 'Photo'
                        : item.kind === 'tape'
                          ? 'Washi tape'
                          : item.kind === 'doodle'
                            ? 'Doodle'
                            : shopItems.find((s) => s.id === item.itemId)?.name ?? item.glyph;
                  return (
                    <Pressable
                      key={item.id}
                      style={[styles.layerRow, isSelected && styles.layerRowActive]}
                      onPress={() => { setSelectedId(item.id); setLayerPanelOpen(false); }}
                    >
                      <View style={[styles.layerThumb, { backgroundColor: item.flowerAsset ? theme.palette.cream : tone.bg }]}>
                        {item.flowerAsset ? (
                          <Image source={item.flowerAsset as any} style={styles.layerThumbImg} resizeMode="contain" />
                        ) : (
                          <Feather name={item.glyph as any} size={13} color={tone.accent} />
                        )}
                      </View>
                      <Text style={styles.layerName} numberOfLines={1}>{itemName}</Text>
                      <View style={styles.layerActions}>
                        <Pressable
                          style={styles.layerBtn}
                          onPress={() => handleBringForward(item.id)}
                          disabled={idx === 0}
                          hitSlop={4}
                        >
                          <Feather name="chevron-up" size={14} color={idx === 0 ? theme.color.fg4 : theme.color.fg2} />
                        </Pressable>
                        <Pressable
                          style={styles.layerBtn}
                          onPress={() => handleSendBack(item.id)}
                          disabled={idx === arr.length - 1}
                          hitSlop={4}
                        >
                          <Feather name="chevron-down" size={14} color={idx === arr.length - 1 ? theme.color.fg4 : theme.color.fg2} />
                        </Pressable>
                      </View>
                    </Pressable>
                  );
                })}
                {currentPageItems.length === 0 && (
                  <View style={styles.layerEmpty}>
                    <Text style={styles.layerEmptyText}>No items on this page</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </>
        )}

        {/* ── Collection drawer ─────────────────────────────────────── */}
        {drawerOpen && (
          <Pressable style={styles.drawerScrim} onPress={() => toggleDrawer(false)} />
        )}
        <Animated.View
          style={[
            styles.drawer,
            isPhone && styles.drawerCompact,
            drawerAnimStyle,
          ]}
        >
          <View style={styles.drawerHeader}>
            <View>
              <Text style={styles.drawerEyebrow}>YOUR COLLECTION</Text>
              <Text style={styles.drawerTitle}>
                {EDITOR_CATEGORIES.find((c) => c.id === drawerCat)?.label}
              </Text>
            </View>
            <Pressable onPress={() => toggleDrawer(false)} hitSlop={8}>
              <Feather name="x" size={20} color={theme.color.fg2} />
            </Pressable>
          </View>

          <DrawerBody
            shopItems={shopItems}
            drawerCat={drawerCat}
            setDrawerCat={setDrawerCat}
            placeItem={placeItem}
            hoveredCategory={hoveredCategory}
            setHoveredCategory={setHoveredCategory}
          />

          {/* Shop CTA — more papers, stickers & seasonal packs */}
          <View style={styles.drawerFooter}>
            <Button
              title="Browse the Shop"
              variant="secondary"
              onPress={() => {
                toggleDrawer(false);
                router.push('/(tabs)/shop');
              }}
            />
          </View>
        </Animated.View>

        {/* ── Text editor ───────────────────────────────────────────── */}
        {editingTextItem && (
          <TextEditorModal
            item={editingTextItem}
            onChange={(patch) => updateTextItem(editingTextItem.id, patch)}
            onClose={closeTextEditor}
          />
        )}

        {/* ── Template picker ───────────────────────────────────────── */}
        {templatePickerOpen && (
          <View style={styles.textModalScrim}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setTemplatePickerOpen(false)} />
            <View style={styles.templateCard}>
              <View style={styles.templateHeader}>
                <View>
                  <Text style={styles.drawerEyebrow}>START FROM A LAYOUT</Text>
                  <Text style={styles.textModalTitle}>Starter templates</Text>
                </View>
                <Pressable onPress={() => setTemplatePickerOpen(false)} hitSlop={8}>
                  <Feather name="x" size={20} color={theme.color.fg2} />
                </Pressable>
              </View>
              <Text style={styles.templateHint}>
                Drops editable pieces onto this page — move, restyle, or delete anything.
              </Text>
              <ScrollView contentContainerStyle={styles.templateGrid}>
                {JOURNAL_TEMPLATES.map((tpl) => {
                  const tone = SHOP_TONES[tpl.tone as keyof typeof SHOP_TONES] ?? SHOP_TONES.sage;
                  return (
                    <Pressable key={tpl.id} style={styles.templateTile} onPress={() => applyTemplate(tpl)}>
                      <View style={[styles.templateThumb, { backgroundColor: tone.bg }]}>
                        <Feather name={tpl.icon as any} size={30} color={tone.accent} />
                      </View>
                      <Text style={styles.templateName}>{tpl.name}</Text>
                      <Text style={styles.templateBlurb} numberOfLines={2}>{tpl.blurb}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        )}

        {/* ── Purchase arrival ──────────────────────────────────────── */}
        {pendingDelivery.length > 0 && (
          <DeliveryOverlay
            items={pendingDelivery}
            onDone={() => {
              const first = pendingDelivery[0];
              const cat = EDITOR_CATEGORIES.find((c) => c.id === first?.category);
              if (cat) setDrawerCat(cat.id);
              clearPendingDelivery();
              toggleDrawer(true);
            }}
          />
        )}
      </Screen>
    </GestureHandlerRootView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { backgroundColor: theme.color.bg2 },

  // Top bar
  topbar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.color.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.hairlineSoft,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.color.bg1,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmed: { opacity: 0.45 },
  hidden: { opacity: 0 },
  nameWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  name: {
    fontFamily: theme.font.display,
    fontSize: 20,
    color: theme.color.fg1,
  },
  nameInput: {
    fontFamily: theme.font.display,
    fontSize: 20,
    color: theme.color.fg1,
    borderBottomWidth: 1.5,
    borderBottomColor: theme.palette.forest,
    paddingVertical: 2,
    minWidth: 160,
  },
  topRight: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  zoomBadge: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.bg1,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomText: {
    fontFamily: theme.font.ui,
    fontSize: 12,
    fontWeight: '600',
    color: theme.color.fg2,
  },
  layersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.bg1,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
  },
  layersText: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    fontWeight: '600',
    color: theme.color.fg1,
  },
  layersBtnActive: {
    backgroundColor: 'rgba(78,102,82,0.12)',
  },

  // Layers panel
  layerPanel: {
    position: 'absolute',
    top: 60,
    right: 0,
    width: 260,
    maxHeight: 420,
    backgroundColor: theme.color.surface,
    borderLeftWidth: 1,
    borderLeftColor: theme.palette.hairline,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.hairline,
    borderBottomLeftRadius: theme.radius.md,
    ...theme.shadow.card,
    zIndex: 150,
    elevation: 10,
  },
  layerPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.hairlineSoft,
  },
  layerPanelTitle: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    fontWeight: '600',
    color: theme.color.fg1,
  },
  layerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.hairlineSoft,
  },
  layerRowActive: {
    backgroundColor: 'rgba(78,102,82,0.08)',
  },
  layerThumb: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  layerThumbImg: {
    width: '80%',
    height: '80%',
  },
  layerName: {
    flex: 1,
    fontFamily: theme.font.ui,
    fontSize: 12,
    color: theme.color.fg1,
  },
  layerActions: {
    flexDirection: 'row',
    gap: 2,
    flexShrink: 0,
  },
  layerBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layerEmpty: {
    padding: 20,
    alignItems: 'center',
  },
  layerEmptyText: {
    fontFamily: theme.font.ui,
    fontSize: 12,
    color: theme.color.fg3,
  },

  // Body layout
  body: { flex: 1, flexDirection: 'row' },

  // Page strip
  strip: {
    width: 68,
    borderRightWidth: 1,
    borderRightColor: theme.palette.hairlineSoft,
    backgroundColor: theme.color.bg1,
  },
  stripScroll: { padding: 10, gap: 8, alignItems: 'center' },
  thumb: {
    width: 46,
    height: 58,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbActive: {
    backgroundColor: theme.palette.forest,
    borderColor: theme.palette.forestDeep,
  },
  thumbNum: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    fontWeight: '600',
    color: theme.color.fg2,
  },
  thumbNumActive: { color: theme.palette.cream },
  thumbTag: {
    fontFamily: theme.font.ui,
    fontSize: 7,
    letterSpacing: 1,
    color: theme.color.fg4,
    marginTop: 2,
  },
  thumbAdd: {
    width: 46,
    height: 58,
    borderRadius: theme.radius.xs,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  thumbCount: {
    fontFamily: theme.font.ui,
    fontSize: 9,
    color: theme.color.fg4,
  },

  // Canvas area — clips the zoomed spread so it can never overlap the page
  // strip, top bar, or toolbar; scrolling lives in the nested ScrollViews.
  canvasArea: {
    flex: 1,
    overflow: 'hidden',
  },
  canvasScroll: { flex: 1 },
  canvasScrollVContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  canvasScrollHContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  spreadContainer: {
    // Fixed layout box (SPREAD × baseScale); zoom only changes the transform.
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  spreadScaled: {
    // Default transform origin (center): scaling keeps the spread centered.
    ...theme.shadow.card,
  },
  toolbarLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'visible',
    zIndex: 100,
    elevation: 10,
  },
  spreadInner: {
    width: SPREAD_W,
    height: SPREAD_H,
    flexDirection: 'row',
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
  },

  // Pages
  page: { flex: 1, height: SPREAD_H, overflow: 'hidden', position: 'relative' },
  pageLeft: {},
  pageRight: {},
  paper: { backgroundColor: '#F6EEDD' },
  leather: {
    backgroundColor: '#5A3D26',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  spineShadow: {
    width: 3,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  monogram: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: 'rgba(255,253,246,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: theme.font.display,
    fontSize: 26,
    color: 'rgba(255,253,246,0.65)',
  },
  leatherLabel: {
    fontFamily: theme.font.ui,
    fontSize: 9,
    letterSpacing: 2.4,
    color: 'rgba(255,253,246,0.45)',
  },
  pageNo: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    fontFamily: theme.font.ui,
    fontSize: 11,
    color: theme.color.fg4,
  },

  // Placed items
  itemFill: { flex: 1 },
  itemInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.xs,
  },
  itemImage: {
    width: '96%',
    height: '96%',
  },

  // Selection frame + handles (Canva-style)
  selectionFrame: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderWidth: 1.5,
    borderColor: theme.palette.forest,
    borderRadius: 3,
  },
  handleTouch: {
    // 24px touch target centered on the frame corner; visible dot is 12px.
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    cursor: 'pointer',
  },
  handleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.palette.cream,
    borderWidth: 1.5,
    borderColor: theme.palette.forest,
    ...theme.shadow.tape,
  },
  rotateHandleWrap: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  rotateStem: {
    width: 1.5,
    height: 14,
    backgroundColor: theme.palette.forest,
  },
  rotateHandle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.color.surface,
    borderWidth: 1.5,
    borderColor: theme.palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    ...theme.shadow.paper,
  },

  // Page flip
  flipStage: {
    width: SPREAD_W,
    height: SPREAD_H,
  },
  spreadHalfClip: {
    width: PAGE_W,
    height: SPREAD_H,
    overflow: 'hidden',
  },
  spreadHalfShift: {
    width: SPREAD_W,
    height: SPREAD_H,
  },
  flipPage: {
    position: 'absolute',
    top: 0,
    width: PAGE_W,
    height: SPREAD_H,
    backfaceVisibility: 'hidden',
    zIndex: 10,
    ...theme.shadow.card,
  },
  flipShade: {
    backgroundColor: theme.palette.charcoal,
  },

  // Item toolbar
  toolbar: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: theme.color.surface,
    borderRadius: 20,
    padding: 4,
    gap: 2,
    ...theme.shadow.card,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
  },
  toolBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  toolDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.palette.hairlineSoft,
    alignSelf: 'center',
    marginHorizontal: 2,
  },
  toolDanger: {},

  // Page nav
  pageNav: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,253,246,0.92)',
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Delete page
  deletePageBtn: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255,253,246,0.85)',
    borderWidth: 1,
    borderColor: theme.palette.hairline,
  },
  deletePageText: {
    fontFamily: theme.font.ui,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.color.fg4,
  },

  // FAB
  fab: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.lift,
  },

  // Drawer
  drawerScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(43,42,40,0.35)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 360,
    backgroundColor: theme.color.surface,
    borderLeftWidth: 1,
    borderLeftColor: theme.palette.hairline,
    ...theme.shadow.lift,
  },
  drawerCompact: { width: 300 },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.hairlineSoft,
  },
  drawerEyebrow: {
    fontFamily: theme.font.ui,
    fontSize: 9,
    letterSpacing: 2.2,
    color: theme.color.fg3,
    fontWeight: '600',
  },
  drawerTitle: {
    fontFamily: theme.font.display,
    fontSize: 19,
    color: theme.color.fg1,
    marginTop: 2,
  },
  drawerBody: { flex: 1, flexDirection: 'row' },
  drawerLeft: { flex: 1 },
  drawerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 12,
    marginBottom: 6,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.bg1,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
  },
  drawerSearchInput: {
    flex: 1,
    fontFamily: theme.font.ui,
    fontSize: 13,
    color: theme.color.fg1,
    paddingVertical: 0,
  },
  drawerSectionLabel: {
    fontFamily: theme.font.ui,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '600',
    color: theme.color.fg3,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
  drawerSectionDivider: {
    height: 1,
    backgroundColor: theme.palette.hairlineSoft,
    marginHorizontal: 14,
    marginTop: 8,
  },
  drawerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 14,
  },
  drawerEmpty: { flexGrow: 1 },
  drawerEmptyInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  drawerEmptyText: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    fontWeight: '600',
    color: theme.color.fg3,
    textAlign: 'center',
  },
  drawerEmptyHint: {
    fontFamily: theme.font.ui,
    fontSize: 12,
    color: theme.color.fg4,
    textAlign: 'center',
  },
  tile: {
    width: 78,
    height: 92,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tileNew: {
    borderWidth: 2,
    borderColor: theme.palette.terracotta,
  },
  tileFlower: { width: '92%', height: '92%' },
  tileNewTag: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.palette.terracotta,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  tileNewText: {
    fontFamily: theme.font.ui,
    fontSize: 7,
    letterSpacing: 1,
    color: theme.palette.cream,
    fontWeight: '700',
  },
  tabRail: {
    width: 52,
    borderLeftWidth: 1,
    borderLeftColor: theme.palette.hairlineSoft,
  },
  tabRailContent: { paddingVertical: 8, alignItems: 'center', gap: 4 },
  tabWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: 'rgba(78,102,82,0.12)' },
  // Tile wrapper for item tooltip positioning
  tileWrapper: {
    position: 'relative',
  },
  // Category tooltip (appears to the LEFT of the tab rail icon)
  catTooltip: {
    position: 'absolute',
    right: 48,
    top: '50%',
    marginTop: -13,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
    ...theme.shadow.card,
    zIndex: 200,
    whiteSpace: 'nowrap',
  } as any,
  // Item name tooltip (appears BELOW the tile)
  itemTooltip: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    marginLeft: -50,
    width: 100,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
    ...theme.shadow.card,
    zIndex: 200,
    alignItems: 'center',
    marginTop: 4,
  },
  tooltipText: {
    fontFamily: theme.font.ui,
    fontSize: 12,
    color: theme.color.fg1,
  },
  drawerFooter: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: theme.palette.hairlineSoft,
    backgroundColor: theme.color.surface,
  },

  // Text items
  textItemInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textItem: {
    textAlign: 'center',
    width: '100%',
  },

  // Photo items
  photoInner: {
    flex: 1,
    borderRadius: theme.radius.xs,
    overflow: 'hidden',
    backgroundColor: theme.palette.cream,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },

  // Mini floating tools (text / photo / tape / pen) stacked under the FAB
  miniFab: {
    position: 'absolute',
    right: 23,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
  miniFabActive: {
    backgroundColor: theme.palette.forest,
    borderColor: theme.palette.forestDeep,
  },
  penLayer: {
    zIndex: 120,
    elevation: 12,
  },
  penHint: {
    position: 'absolute',
    bottom: 52,
    alignSelf: 'center',
    backgroundColor: 'rgba(43,42,40,0.78)',
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  penHintText: {
    fontFamily: theme.font.ui,
    fontSize: 12,
    color: theme.palette.cream,
  },
  toolBtnActive: {
    backgroundColor: 'rgba(78,102,82,0.12)',
  },

  // Washi tape
  tapeInner: {
    flex: 1,
    opacity: 0.82,
    borderRadius: 1,
    overflow: 'hidden',
  },
  tapeNotch: {
    position: 'absolute',
    top: '20%',
    bottom: '20%',
    width: 10,
    backgroundColor: 'rgba(246,238,221,0.55)',
    transform: [{ rotate: '12deg' }],
  },

  // Text editor modal
  textModalScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(43,42,40,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
    elevation: 20,
  },
  textModalCard: {
    width: 380,
    maxWidth: '90%',
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    padding: 20,
    gap: 10,
    ...theme.shadow.lift,
  },
  textModalTitle: {
    fontFamily: theme.font.display,
    fontSize: 20,
    color: theme.color.fg1,
  },
  textModalInput: {
    minHeight: 64,
    maxHeight: 160,
    fontSize: 24,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.bg1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textModalLabel: {
    fontFamily: theme.font.ui,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '600',
    color: theme.color.fg3,
    marginTop: 4,
  },
  fontRow: {
    gap: 8,
    paddingVertical: 2,
  },
  fontChip: {
    width: 64,
    paddingVertical: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    backgroundColor: theme.color.bg1,
    alignItems: 'center',
    gap: 2,
  },
  fontChipActive: {
    borderColor: theme.palette.forest,
    backgroundColor: 'rgba(78,102,82,0.10)',
  },
  fontChipSample: {
    fontSize: 22,
    color: theme.color.fg1,
    lineHeight: 26,
  },
  fontChipLabel: {
    fontFamily: theme.font.ui,
    fontSize: 10,
    color: theme.color.fg3,
  },
  fontChipLabelActive: {
    color: theme.palette.forest,
    fontWeight: '700',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  colorSwatchLight: {
    borderWidth: 1,
    borderColor: theme.palette.hairline,
  },
  colorSwatchActive: {
    borderWidth: 3,
    borderColor: theme.palette.forest,
  },
  textModalActions: {
    marginTop: 8,
  },

  // Template picker
  templateCard: {
    width: 560,
    maxWidth: '92%',
    maxHeight: '84%',
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    padding: 20,
    ...theme.shadow.lift,
  },
  templateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateHint: {
    fontFamily: theme.font.ui,
    fontSize: 12,
    color: theme.color.fg3,
    marginTop: 6,
    marginBottom: 12,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  templateTile: {
    width: 158,
    gap: 6,
  },
  templateThumb: {
    width: '100%',
    height: 96,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateName: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    fontWeight: '600',
    color: theme.color.fg1,
  },
  templateBlurb: {
    fontFamily: theme.font.ui,
    fontSize: 11,
    color: theme.color.fg3,
    lineHeight: 15,
  },

  // Delivery / unboxing overlay
  deliveryScrimWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 400,
    elevation: 24,
  },
  deliveryBackdrop: {
    backgroundColor: 'rgba(43,42,40,0.55)',
  },
  deliveryReveal: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  deliveryEyebrow: {
    fontFamily: theme.font.ui,
    fontSize: 11,
    letterSpacing: 2.8,
    fontWeight: '600',
    color: theme.palette.cream,
    opacity: 0.8,
  },
  deliveryTitle: {
    fontFamily: theme.font.display,
    fontSize: 30,
    color: theme.palette.cream,
    textAlign: 'center',
  },
  deliveryItemRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  deliveryTile: {
    alignItems: 'center',
    gap: 6,
    width: 96,
  },
  deliveryTileArt: {
    width: 88,
    height: 100,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...theme.shadow.tape,
  },
  deliveryTileImg: { width: '88%', height: '88%' },
  deliveryTileLabel: {
    fontFamily: theme.font.ui,
    fontSize: 11,
    color: theme.palette.cream,
    textAlign: 'center',
  },
  deliverySub: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: 15,
    color: theme.palette.cream,
    opacity: 0.85,
    marginTop: 6,
    textAlign: 'center',
  },
  deliveryBox: {
    position: 'absolute',
    width: 150,
    height: 120,
    backgroundColor: '#C4A377',
    borderRadius: theme.radius.sm,
    ...theme.shadow.lift,
  },
  deliveryBoxLid: {
    position: 'absolute',
    left: -4,
    right: -4,
    top: -2,
    height: 36,
    backgroundColor: '#D3B289',
    borderRadius: theme.radius.sm,
  },
  deliveryBoxStringV: {
    position: 'absolute',
    left: '50%',
    marginLeft: -2,
    top: -6,
    bottom: 0,
    width: 4,
    backgroundColor: theme.palette.espresso,
  },
  deliveryBoxStringH: {
    position: 'absolute',
    top: '52%',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: theme.palette.espresso,
  },
  deliveryBoxStamp: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 38,
    height: 46,
    backgroundColor: theme.palette.cream,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.palette.terracotta,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryBoxStampText: {
    fontFamily: theme.font.display,
    fontSize: 14,
    color: theme.palette.terracotta,
    transform: [{ rotate: '-10deg' }],
  },
});
