import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { theme } from '../../src/theme/theme';
import { useAppStore } from '../../src/store/app';
import { DRAWER_CATEGORIES, SHOP_TONES } from '../../src/data/shop';

// SCR-07 Journal Editor — functional placeholder for the canvas engine.
//
// Page model: page 1 is a single page on the RIGHT (left side is the leather
// inside front cover); pages 2..N-1 are open double spreads; page N is a
// single page on the LEFT (right side is the leather back cover). Max 30
// pages. Page changes cross-fade (the full 3-D page-turn arrives with the
// Skia engine in Phase 3).
//
// The floating "+" opens the collection drawer (slides from the right) with
// the store-matched category tabs. Tapping an item places it on the current
// page at a soft random spot — drag/resize/rotate land in Phase 3.

const MAX_PAGES = 30;

interface PlacedItem {
  id: string;
  page: number;
  glyph: string;
  tone: keyof typeof SHOP_TONES;
  x: number; // 0..1 of page width
  y: number; // 0..1 of page height
  rot: string;
  flowerAsset?: number;
}

const FLOWER_ASSETS = [
  require('../../assets/flowers/01-cornflower-violet.png'),
  require('../../assets/flowers/02-poppy-red.png'),
  require('../../assets/flowers/03-cosmos-lavender.png'),
  require('../../assets/flowers/04-wildrose-pink.png'),
  require('../../assets/flowers/05-cherryblossom-cluster.png'),
  require('../../assets/flowers/06-zinnia-crimson.png'),
];

// Drawer items per category — placeholder glyph tiles; florals use real art.
const DRAWER_ITEMS: Record<string, { glyph: string; tone: keyof typeof SHOP_TONES; flowerAsset?: number }[]> = {
  collections: [
    { glyph: 'package', tone: 'sage' }, { glyph: 'package', tone: 'rose' },
    { glyph: 'package', tone: 'blue' }, { glyph: 'package', tone: 'amber' },
  ],
  papers: [
    { glyph: 'file-text', tone: 'cream' }, { glyph: 'file-text', tone: 'sage' },
    { glyph: 'file', tone: 'amber' }, { glyph: 'file', tone: 'rose' },
    { glyph: 'file-text', tone: 'mauve' }, { glyph: 'file', tone: 'blue' },
  ],
  stickers: [
    { glyph: 'disc', tone: 'oxblood' }, { glyph: 'star', tone: 'amber' },
    { glyph: 'heart', tone: 'rose' }, { glyph: 'check', tone: 'sage' },
    { glyph: 'arrow-right', tone: 'forest' }, { glyph: 'star', tone: 'gold' },
  ],
  tape: [
    { glyph: 'minus', tone: 'sage' }, { glyph: 'minus', tone: 'rose' },
    { glyph: 'minus', tone: 'amber' }, { glyph: 'paperclip', tone: 'gold' },
    { glyph: 'link', tone: 'mauve' },
  ],
  ephemera: [
    { glyph: 'mail', tone: 'oxblood' }, { glyph: 'credit-card', tone: 'mauve' },
    { glyph: 'mail', tone: 'cream' }, { glyph: 'credit-card', tone: 'amber' },
  ],
  florals: FLOWER_ASSETS.map((asset, i) => ({
    glyph: 'feather',
    tone: (['mauve', 'oxblood', 'blue', 'rose', 'rose', 'oxblood'] as const)[i],
    flowerAsset: asset,
  })),
  frames: [
    { glyph: 'circle', tone: 'gold' }, { glyph: 'square', tone: 'gold' },
    { glyph: 'tag', tone: 'cream' },
  ],
  type: [
    { glyph: 'edit-3', tone: 'forest' }, { glyph: 'hash', tone: 'oxblood' },
    { glyph: 'type', tone: 'cream' },
  ],
  paint: [
    { glyph: 'droplet', tone: 'rose' }, { glyph: 'edit-2', tone: 'sage' },
    { glyph: 'edit-2', tone: 'mauve' },
  ],
  fabric: [
    { glyph: 'layers', tone: 'sage' }, { glyph: 'layers', tone: 'cream' },
    { glyph: 'x', tone: 'rose' },
  ],
  photos: [
    { glyph: 'image', tone: 'cream' }, { glyph: 'copy', tone: 'blue' },
  ],
  details: [
    { glyph: 'sun', tone: 'cream' }, { glyph: 'gift', tone: 'oxblood' },
    { glyph: 'gift', tone: 'rose' },
  ],
};

export default function EditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const journal = useAppStore((s) => s.journals.find((j) => j.id === id));
  const renameJournal = useAppStore((s) => s.renameJournal);

  const [pages, setPages] = useState(8);
  const [page, setPage] = useState(2);
  const [placed, setPlaced] = useState<PlacedItem[]>([]);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(journal?.name ?? 'Journal');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCat, setDrawerCat] = useState('papers');

  const pageFade = useRef(new Animated.Value(1)).current;
  const drawerX = useRef(new Animated.Value(360)).current;

  const { width } = useWindowDimensions();
  const compact = width < theme.layout.phoneBreakpoint;

  const goToPage = (p: number) => {
    if (p === page || p < 1 || p > pages) return;
    // Cross-fade placeholder for the page-turn animation.
    Animated.timing(pageFade, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setPage(p);
      Animated.timing(pageFade, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
    });
  };

  const addPage = () => setPages((n) => Math.min(n + 1, MAX_PAGES));

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
    Animated.timing(drawerX, {
      toValue: open ? 0 : 360,
      duration: 320,
      useNativeDriver: true,
    }).start();
  };

  const placeItem = (item: { glyph: string; tone: keyof typeof SHOP_TONES; flowerAsset?: number }) => {
    setPlaced((arr) => [
      ...arr,
      {
        id: `p-${Date.now()}`,
        page,
        glyph: item.glyph,
        tone: item.tone,
        flowerAsset: item.flowerAsset,
        x: 0.18 + Math.random() * 0.55,
        y: 0.15 + Math.random() * 0.55,
        rot: `${Math.round(Math.random() * 16 - 8)}deg`,
      },
    ]);
    toggleDrawer(false);
  };

  const commitName = () => {
    setEditingName(false);
    const name = nameDraft.trim();
    if (name && journal) renameJournal(journal.id, name);
    else setNameDraft(journal?.name ?? 'Journal');
  };

  const isFirst = page === 1;
  const isLast = page === pages;
  const pageItems = placed.filter((it) => it.page === page);

  return (
    <Screen texture={false} style={styles.root}>
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <View style={styles.topbar}>
        <Pressable style={styles.iconBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={theme.color.fg1} />
        </Pressable>

        {/* Editable journal name */}
        {editingName ? (
          <TextInput
            style={styles.nameInput}
            value={nameDraft}
            onChangeText={setNameDraft}
            onBlur={commitName}
            onSubmitEditing={commitName}
            autoFocus
          />
        ) : (
          <Pressable style={styles.nameWrap} onPress={() => setEditingName(true)}>
            <Text style={styles.name} numberOfLines={1}>
              {journal?.name ?? 'Journal'}
            </Text>
            <Feather name="edit-2" size={14} color={theme.color.fg3} />
          </Pressable>
        )}

        <View style={styles.topRight}>
          {/* Undo / redo — wired to history in Phase 3 with the canvas engine */}
          <Pressable style={[styles.iconBtn, styles.dimmed]} disabled>
            <Feather name="rotate-ccw" size={18} color={theme.color.fg3} />
          </Pressable>
          <Pressable style={[styles.iconBtn, styles.dimmed]} disabled>
            <Feather name="rotate-cw" size={18} color={theme.color.fg3} />
          </Pressable>
          <Pressable style={styles.layersBtn}>
            <Feather name="layers" size={16} color={theme.color.fg1} />
            <Text style={styles.layersText}>{pageItems.length}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.body}>
        {/* ── Page strip ───────────────────────────────────────────── */}
        <View style={styles.strip}>
          <ScrollView contentContainerStyle={styles.stripScroll}>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <Pressable
                key={p}
                style={[styles.thumb, p === page && styles.thumbActive]}
                onPress={() => goToPage(p)}
              >
                <Text
                  style={[styles.thumbNum, p === page && styles.thumbNumActive]}
                >
                  {p}
                </Text>
                {(p === 1 || p === pages) && (
                  <Text style={[styles.thumbTag, p === page && styles.thumbNumActive]}>
                    {p === 1 ? 'FIRST' : 'LAST'}
                  </Text>
                )}
              </Pressable>
            ))}
            <Pressable
              style={[styles.thumbAdd, pages >= MAX_PAGES && styles.dimmed]}
              onPress={addPage}
              disabled={pages >= MAX_PAGES}
            >
              <Feather name="plus" size={18} color={theme.color.fg2} />
              <Text style={styles.thumbCount}>
                {pages}/{MAX_PAGES}
              </Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* ── Canvas ───────────────────────────────────────────────── */}
        <View style={styles.canvasArea}>
          <Animated.View style={[styles.spread, { opacity: pageFade }]}>
            {/* Left side */}
            {isFirst ? (
              <LeatherCover side="left" label="FRONT COVER · INSIDE" />
            ) : (
              <PaperPage
                items={isLast ? pageItems : pageItems}
                showItems={true}
                pageNo={isLast ? page : page % 2 === 0 ? page : page - 1}
              />
            )}
            {/* Spine */}
            <View style={styles.spineShadow} />
            {/* Right side */}
            {isLast ? (
              <LeatherCover side="right" label="BACK COVER · INSIDE" />
            ) : (
              <PaperPage
                items={isFirst ? pageItems : []}
                showItems={isFirst}
                pageNo={isFirst ? 1 : page % 2 === 0 ? page + 1 : page}
              />
            )}
          </Animated.View>

          {/* Page nav affordances */}
          <Pressable
            style={[styles.pageNav, { left: 8 }, page <= 1 && styles.hidden]}
            onPress={() => goToPage(page - 1)}
          >
            <Feather name="chevron-left" size={24} color={theme.color.fg2} />
          </Pressable>
          <Pressable
            style={[styles.pageNav, { right: 8 }, page >= pages && styles.hidden]}
            onPress={() => goToPage(page + 1)}
          >
            <Feather name="chevron-right" size={24} color={theme.color.fg2} />
          </Pressable>

          {/* Floating add button */}
          <Pressable style={styles.fab} onPress={() => toggleDrawer(true)}>
            <Feather name="plus" size={26} color={theme.palette.cream} />
          </Pressable>

          {/* Hint */}
          <Text style={styles.hint}>
            Tap + to add from your collection · full drag & drop arrives with
            the canvas engine
          </Text>
        </View>
      </View>

      {/* ── Collection drawer ─────────────────────────────────────── */}
      {drawerOpen && (
        <Pressable style={styles.drawerScrim} onPress={() => toggleDrawer(false)} />
      )}
      <Animated.View
        style={[
          styles.drawer,
          compact && styles.drawerCompact,
          { transform: [{ translateX: drawerX }] },
        ]}
      >
        <View style={styles.drawerHeader}>
          <View>
            <Text style={styles.drawerEyebrow}>YOUR COLLECTION</Text>
            <Text style={styles.drawerTitle}>
              {DRAWER_CATEGORIES.find((c) => c.id === drawerCat)?.label}
            </Text>
          </View>
          <Pressable onPress={() => toggleDrawer(false)} hitSlop={8}>
            <Feather name="x" size={20} color={theme.color.fg2} />
          </Pressable>
        </View>

        <View style={styles.drawerBody}>
          {/* Item grid */}
          <ScrollView contentContainerStyle={styles.drawerGrid}>
            {(DRAWER_ITEMS[drawerCat] ?? []).map((item, i) => {
              const tone = SHOP_TONES[item.tone];
              const isNewItem = i < 2;
              return (
                <Pressable
                  key={`${drawerCat}-${i}`}
                  style={[
                    styles.tile,
                    item.flowerAsset
                      ? { backgroundColor: theme.palette.cream }
                      : { backgroundColor: tone.bg },
                    isNewItem && styles.tileNew,
                  ]}
                  onPress={() => placeItem(item)}
                >
                  {item.flowerAsset ? (
                    <Image
                      source={item.flowerAsset}
                      style={styles.tileFlower}
                      resizeMode="contain"
                    />
                  ) : (
                    <Feather name={item.glyph as any} size={28} color={tone.accent} />
                  )}
                  {isNewItem && (
                    <View style={styles.tileNewTag}>
                      <Text style={styles.tileNewText}>NEW</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Category tabs on the right edge */}
          <ScrollView style={styles.tabRail} contentContainerStyle={styles.tabRailContent}>
            {DRAWER_CATEGORIES.map((c) => {
              const isActive = c.id === drawerCat;
              return (
                <Pressable
                  key={c.id}
                  style={[styles.tab, isActive && styles.tabActive]}
                  onPress={() => setDrawerCat(c.id)}
                >
                  <Feather
                    name={c.icon}
                    size={18}
                    color={isActive ? theme.palette.forest : theme.color.fg3}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Animated.View>
    </Screen>
  );
}

function LeatherCover({ side, label }: { side: 'left' | 'right'; label: string }) {
  return (
    <View
      style={[
        styles.page,
        styles.leather,
        side === 'left' ? styles.pageLeft : styles.pageRight,
      ]}
    >
      <View style={styles.monogram}>
        <Text style={styles.monogramText}>P&P</Text>
      </View>
      <Text style={styles.leatherLabel}>{label}</Text>
    </View>
  );
}

function PaperPage({
  items,
  showItems,
  pageNo,
}: {
  items: PlacedItem[];
  showItems: boolean;
  pageNo: number;
}) {
  return (
    <View style={[styles.page, styles.paper]}>
      {showItems &&
        items.map((it) => {
          const tone = SHOP_TONES[it.tone];
          return (
            <View
              key={it.id}
              style={[
                styles.placedItem,
                {
                  left: `${it.x * 100}%` as const,
                  top: `${it.y * 100}%` as const,
                  transform: [{ rotate: it.rot }],
                },
                it.flowerAsset
                  ? styles.placedFlower
                  : { backgroundColor: tone.bg },
              ]}
            >
              {it.flowerAsset ? (
                <Image
                  source={it.flowerAsset}
                  style={styles.placedFlowerImg}
                  resizeMode="contain"
                />
              ) : (
                <Feather name={it.glyph as any} size={26} color={tone.accent} />
              )}
            </View>
          );
        })}
      <Text style={styles.pageNo}>{pageNo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: theme.color.bg2 },
  topbar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.color.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.hairlineSoft,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    gap: 8,
  },
  layersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: 14,
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

  // Canvas
  canvasArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  spread: {
    flexDirection: 'row',
    width: '92%',
    maxWidth: 760,
    aspectRatio: 1.45,
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  page: { flex: 1, position: 'relative' },
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
  placedItem: {
    position: 'absolute',
    width: 64,
    height: 76,
    borderRadius: theme.radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.tape,
  },
  placedFlower: { backgroundColor: 'transparent' },
  placedFlowerImg: { width: 76, height: 88 },
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
  hint: {
    position: 'absolute',
    bottom: 10,
    fontFamily: theme.font.ui,
    fontSize: 11,
    color: theme.color.fg4,
    textAlign: 'center',
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
  tab: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: 'rgba(78,102,82,0.12)' },
});
