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
  runOnJS,
  Easing,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/theme/theme';
import { useAppStore } from '../../src/store/app';
import { DRAWER_CATEGORIES, SHOP_TONES, ShopItem } from '../../src/data/shop';
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
  glyph: string;
  tone: string;
  flowerAsset?: number;
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
}

function PlacedItemView({
  item,
  isSelected,
  spreadScale,
  onSelect,
  onMoveEnd,
  onResizeEnd,
  onRotateEnd,
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
    Gesture.Simultaneous(tapGesture, panGesture),
  );

  // ── Handle drag state (one drag at a time, so one pair is enough) ──────────
  // Start vector: handle position relative to the item center, in screen px.
  const startVX = useSharedValue(0);
  const startVY = useSharedValue(0);

  /** Corner resize handle: proportional scale from the item center. */
  function makeCornerGesture(hx: number, hy: number) {
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

  const toneKey = item.tone as keyof typeof SHOP_TONES;
  const { bg, accent } = SHOP_TONES[toneKey] ?? SHOP_TONES.sage;

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
          <View style={[styles.itemInner, { backgroundColor: bg }]}>
            {item.flowerAsset ? (
              <Image source={item.flowerAsset} style={styles.itemImage} resizeMode="contain" />
            ) : (
              <Feather name={item.glyph as any} size={Math.min(item.w, item.h) * 0.4} color={accent} />
            )}
          </View>
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
                  hx < 0 ? { left: -12 } : { right: -12 },
                  hy < 0 ? { top: -12 } : { bottom: -12 },
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
}

function ItemToolbar({ left, top, onBringForward, onSendBack, onDelete }: ItemToolbarProps) {
  return (
    <View style={[styles.toolbar, { left, top }]}>
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
  placeItem: (item: { id: string; glyph: string; tone: string; flowerAsset?: number }) => void;
}

function DrawerBody({ shopItems, drawerCat, setDrawerCat, placeItem }: DrawerBodyProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

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

  // Filter out collections from the item grid
  const visibleItems = (itemsByCategory[drawerCat] ?? []).filter(
    (item) => item.category !== 'collections',
  );

  return (
    <View style={styles.drawerBody}>
      {/* Item grid */}
      <ScrollView contentContainerStyle={styles.drawerGrid}>
        {visibleItems.map((item) => {
          const toneKey = item.tone as keyof typeof SHOP_TONES;
          const tone = SHOP_TONES[toneKey] ?? SHOP_TONES.sage;
          return (
            <View key={item.id} style={styles.tileWrapper}>
              <Pressable
                style={[
                  styles.tile,
                  item.flowerAsset
                    ? { backgroundColor: theme.palette.cream }
                    : { backgroundColor: tone.bg },
                  item.isNew && styles.tileNew,
                ]}
                onPress={() =>
                  placeItem({
                    id: item.id,
                    glyph: item.glyph,
                    tone: item.tone,
                    flowerAsset: item.flowerAsset,
                  })
                }
                {...({
                  onPointerEnter: () => setHoveredItemId(item.id),
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
              {hoveredItemId === item.id && (
                <View style={styles.itemTooltip} pointerEvents="none">
                  <Text style={styles.tooltipText}>{item.name}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

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
              {hoveredCategory === c.id && (
                <View style={styles.catTooltip} pointerEvents="none">
                  <Text style={styles.tooltipText}>{c.label}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
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
          />
        ))}
      </View>
    </View>
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
  function placeItem(shopItem: { id: string; glyph: string; tone: string; flowerAsset?: number }) {
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
            <Pressable style={styles.layersBtn}>
              <Feather name="layers" size={16} color={theme.color.fg1} />
              <Text style={styles.layersText}>{currentPageItems.length}</Text>
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
                      />
                    )}
                  </View>

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
    ...theme.shadow.tape,
  },
  itemImage: {
    width: '80%',
    height: '80%',
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
  drawerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 14,
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
  tileFlower: { width: '85%', height: '85%' },
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
  // Item name tooltip (appears ABOVE the tile)
  itemTooltip: {
    position: 'absolute',
    bottom: '100%',
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
    marginBottom: 4,
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
});
