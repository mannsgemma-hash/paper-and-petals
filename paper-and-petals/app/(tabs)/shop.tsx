import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { theme } from '../../src/theme/theme';
import { useAppStore } from '../../src/store/app';
import {
  SHOP_CATEGORIES,
  SHOP_TONES,
  isItemUnlocked,
  type ShopItem,
} from '../../src/data/shop';
import { fetchLiveItems, sanityItemToShopItem } from '../../src/services/content';
import { screen, track } from '../../src/lib/analytics';
import { purchaseSingleItem } from '../../src/lib/revenuecat';

// SCR-06 Shop. Search bar at the top, wrapping centred category chips, then
// a grid of items. Tapping an item opens a detail panel with a large preview
// and either a price CTA or an "Owned" stamp.

// Same brand seal as Home (top-left there); the shop shows it top-right.
const logoSage = require('../../assets/logos/logo_sage.png');

export default function ShopScreen() {
  const router = useRouter();
  const ownedItems = useAppStore((s) => s.ownedItems);
  const hasStudio = useAppStore((s) => s.hasStudio);
  const markItemOwned = useAppStore((s) => s.markItemOwned);
  const queueDelivery = useAppStore((s) => s.queueDelivery);
  const shopItems = useAppStore((s) => s.shopItems);
  const setShopItems = useAppStore((s) => s.setShopItems);
  const [purchasing, setPurchasing] = useState(false);

  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [openItem, setOpenItem] = useState<ShopItem | null>(null);

  useEffect(() => {
    screen('Shop');
    fetchLiveItems().then((results) => {
      if (results.length > 0) {
        setShopItems(results.map(sanityItemToShopItem));
      }
    });
  }, []);

  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 4 : width >= 640 ? 3 : 2;

  // Unlocked = can place it (free, owned, or via Studio). Owned = theirs to keep
  // regardless of subscription (free items + purchased keepsake packs).
  const isUnlocked = (it: ShopItem) => isItemUnlocked(it, ownedItems, hasStudio);
  const isOwnedOutright = (it: ShopItem) =>
    it.tier === 'free' || it.price === 0 || !!ownedItems[it.id];

  const filtered = useMemo(
    () =>
      shopItems.filter(
        (it) =>
          (category === 'all' || it.category === category) &&
          (!query || it.name.toLowerCase().includes(query.toLowerCase()))
      ),
    [shopItems, category, query]
  );

  const sectionLabel =
    category === 'all'
      ? query
        ? `Results for “${query}”`
        : 'Featured today'
      : SHOP_CATEGORIES.find((c) => c.id === category)?.label;

  return (
    <Screen>
      {/* Top bar */}
      <View style={styles.topbar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={theme.color.fg1} />
        </Pressable>
        <View style={styles.topTitle}>
          <Text style={styles.topTitleSerif}>The </Text>
          <Text style={styles.topTitleScript}>shop</Text>
        </View>
        <Image source={logoSage} style={styles.brandLogo} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <Text style={styles.hero}>What will you craft today?</Text>
        <Text style={styles.heroSub}>
          A little library of papers, stickers, and treasures.
        </Text>

        {/* Studio banner — the route to the whole catalogue */}
        {!hasStudio ? (
          <Pressable style={styles.studioBanner} onPress={() => router.push('/studio')}>
            <View style={styles.studioBannerIcon}>
              <Feather name="package" size={20} color={theme.palette.cream} />
            </View>
            <View style={styles.studioBannerText}>
              <Text style={styles.studioBannerTitle}>Unlock everything with Studio</Text>
              <Text style={styles.studioBannerSub}>
                The whole living library + new items every week. 7 days free.
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.palette.forest} />
          </Pressable>
        ) : (
          <View style={[styles.studioBanner, styles.studioBannerActive]}>
            <View style={styles.studioBannerIcon}>
              <Feather name="check" size={20} color={theme.palette.cream} />
            </View>
            <View style={styles.studioBannerText}>
              <Text style={styles.studioBannerTitle}>Studio is active</Text>
              <Text style={styles.studioBannerSub}>
                Every item below is unlocked — place anything you like.
              </Text>
            </View>
          </View>
        )}

        {/* Search */}
        <View style={styles.search}>
          <Feather name="search" size={20} color={theme.color.fg3} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search papers, stickers, ephemera…"
            placeholderTextColor={theme.color.fg4}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Feather name="x" size={16} color={theme.color.fg3} />
            </Pressable>
          )}
        </View>

        {/* Categories — wrap onto centred rows */}
        <View style={styles.categories}>
          {SHOP_CATEGORIES.map((c) => {
            const isActive = c.id === category;
            return (
              <Pressable
                key={c.id}
                style={styles.catBtn}
                onPress={() => setCategory(c.id)}
              >
                <View style={[styles.catCircle, isActive && styles.catCircleActive]}>
                  <Feather
                    name={c.icon}
                    size={22}
                    color={isActive ? theme.palette.cream : theme.color.fg1}
                  />
                </View>
                <Text style={[styles.catLabel, isActive && styles.catLabelActive]}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Section label */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{sectionLabel}</Text>
          <Text style={styles.sectionCount}>{filtered.length} ITEMS</Text>
        </View>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Text style={styles.empty}>
            We couldn’t find anything matching that yet.
          </Text>
        ) : (
          <View style={styles.grid}>
            {filtered.map((it) => (
              <View key={it.id} style={{ width: `${100 / columns}%` as const, padding: 7 }}>
                <ItemCard
                  item={it}
                  unlocked={isUnlocked(it)}
                  ownedOutright={isOwnedOutright(it)}
                  onOpen={() => setOpenItem(it)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Detail modal */}
      <ItemDetail
        item={openItem}
        unlocked={openItem ? isUnlocked(openItem) : false}
        ownedOutright={openItem ? isOwnedOutright(openItem) : false}
        hasStudio={hasStudio}
        purchasing={purchasing}
        onClose={() => setOpenItem(null)}
        onUnlockStudio={() => {
          setOpenItem(null);
          router.push('/studio');
        }}
        onPurchase={async (it) => {
          Alert.alert(
            it.name,
            `$${it.price.toFixed(2)} · ${it.items} pieces`,
            [
              {
                text: `Buy for $${it.price.toFixed(2)}`,
                onPress: async () => {
                  setPurchasing(true);
                  try {
                    const ok = await purchaseSingleItem(it.id);
                    if (ok) {
                      markItemOwned(it.id);
                      queueDelivery(it);
                      track('item_purchased', { itemId: it.id, price: it.price });
                      setOpenItem(null);
                      Alert.alert(
                        'On its way!',
                        `${it.name} has been added to your collection — open a journal to watch it arrive.`,
                      );
                    }
                  } catch (e: any) {
                    Alert.alert('Purchase unavailable', e.message ?? 'Please try again in a moment.');
                  } finally {
                    setPurchasing(false);
                  }
                },
              },
              { text: 'Cancel', style: 'cancel' },
            ],
          );
        }}
      />
    </Screen>
  );
}

function ItemArt({ item, large }: { item: ShopItem; large?: boolean }) {
  const tone = SHOP_TONES[item.tone];
  if (item.flowerAsset) {
    return (
      <View style={[styles.art, { backgroundColor: theme.palette.cream }]}>
        <Image
          source={item.flowerAsset}
          style={large ? styles.flowerLarge : styles.flower}
          resizeMode="contain"
        />
      </View>
    );
  }
  return (
    <View style={[styles.art, { backgroundColor: tone.bg }]}>
      <Feather name={item.glyph} size={large ? 72 : 40} color={tone.accent} />
    </View>
  );
}

/** A small status pill: Free / Owned / Studio / one-time price. */
function StatusTag({
  item,
  unlocked,
  ownedOutright,
}: {
  item: ShopItem;
  unlocked: boolean;
  ownedOutright: boolean;
}) {
  if (item.tier === 'free' || item.price === 0) {
    return (
      <View style={styles.freeTag}>
        <Text style={styles.freeText}>FREE</Text>
      </View>
    );
  }
  // Bought outright (or free) — truly theirs to keep.
  if (ownedOutright) {
    return (
      <View style={styles.ownedTag}>
        <Feather name="check" size={12} color={theme.palette.forest} />
        <Text style={styles.ownedText}>OWNED</Text>
      </View>
    );
  }
  // Unlocked only because Studio is active, or simply gated behind it.
  if (unlocked || item.tier === 'catalogue') {
    return (
      <View style={styles.studioTag}>
        <Feather name={unlocked ? 'check' : 'package'} size={11} color={theme.palette.forest} />
        <Text style={styles.studioTagText}>STUDIO</Text>
      </View>
    );
  }
  // pack — one-time purchase
  return (
    <View style={styles.priceTag}>
      <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
    </View>
  );
}

function ItemCard({
  item,
  unlocked,
  ownedOutright,
  onOpen,
}: {
  item: ShopItem;
  unlocked: boolean;
  ownedOutright: boolean;
  onOpen: () => void;
}) {
  const showLock = !unlocked;
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.97 }] }]}
    >
      <View style={styles.cardArt}>
        <ItemArt item={item} />
        {item.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
        {showLock && (
          <View style={styles.lockBadge}>
            <Feather name="lock" size={11} color={theme.palette.terracotta} />
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.cardFoot}>
          <StatusTag item={item} unlocked={unlocked} ownedOutright={ownedOutright} />
          <Text style={styles.pcs}>{item.items} PCS</Text>
        </View>
      </View>
    </Pressable>
  );
}

function ItemDetail({
  item,
  unlocked,
  ownedOutright,
  hasStudio,
  purchasing,
  onClose,
  onPurchase,
  onUnlockStudio,
}: {
  item: ShopItem | null;
  unlocked: boolean;
  ownedOutright: boolean;
  hasStudio: boolean;
  purchasing: boolean;
  onClose: () => void;
  onPurchase: (it: ShopItem) => void;
  onUnlockStudio: () => void;
}) {
  const categoryLabel = item
    ? SHOP_CATEGORIES.find((c) => c.id === item.category)?.label
    : '';
  return (
    <Modal visible={!!item} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.detail} onPress={() => {}}>
          {item && (
            <>
              <View style={styles.detailArt}>
                <ItemArt item={item} large />
              </View>
              <View style={styles.detailBody}>
                <Text style={styles.detailEyebrow}>
                  {categoryLabel?.toUpperCase()}
                </Text>
                <Text style={styles.detailTitle}>{item.name}</Text>
                <Text style={styles.detailDesc}>{item.desc}</Text>
                <Text style={styles.detailPcs}>{item.items} pieces in this set</Text>
                {/* Why it's locked, when relevant */}
                {!unlocked && item.tier === 'catalogue' && (
                  <Text style={styles.detailNote}>
                    Part of the Studio library — unlock it along with everything else.
                  </Text>
                )}
                {!unlocked && item.tier === 'pack' && (
                  <Text style={styles.detailNote}>
                    Buy once and it’s yours forever — or unlock it free with Studio.
                  </Text>
                )}
                <View style={styles.detailFooter}>
                  <StatusTag item={item} unlocked={unlocked} ownedOutright={ownedOutright} />
                  {unlocked ? (
                    <Pressable style={styles.useBtn} onPress={onClose}>
                      <Text style={styles.useBtnText}>Use in editor</Text>
                    </Pressable>
                  ) : item.tier === 'catalogue' ? (
                    <Pressable style={styles.buyBtn} onPress={onUnlockStudio}>
                      <Feather name="package" size={14} color={theme.palette.cream} />
                      <Text style={styles.buyBtnText}>Unlock with Studio</Text>
                    </Pressable>
                  ) : (
                    // pack, not owned
                    <View style={styles.detailCtaCol}>
                      <Pressable
                        style={[styles.buyBtn, purchasing && { opacity: 0.6 }]}
                        onPress={() => onPurchase(item)}
                        disabled={purchasing}
                      >
                        <Feather name="star" size={14} color={theme.palette.cream} />
                        <Text style={styles.buyBtnText}>
                          {purchasing ? 'Adding…' : `Buy $${item.price.toFixed(2)}`}
                        </Text>
                      </Pressable>
                      {!hasStudio && (
                        <Pressable onPress={onUnlockStudio} hitSlop={6}>
                          <Text style={styles.orStudio}>or unlock with Studio</Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              </View>
              <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
                <Feather name="x" size={18} color={theme.color.fg2} />
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  topbar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { flexDirection: 'row', alignItems: 'baseline' },
  brandLogo: { width: 44, height: 44, resizeMode: 'contain' },
  topTitleSerif: {
    fontFamily: theme.font.display,
    fontSize: 22,
    color: theme.color.fg1,
  },
  topTitleScript: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: 24,
    color: theme.palette.terracotta,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    maxWidth: 920,
    width: '100%',
    alignSelf: 'center',
  },
  hero: {
    fontFamily: theme.font.display,
    fontSize: 30,
    color: theme.color.fg1,
    textAlign: 'center',
    marginTop: 4,
  },
  heroSub: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: theme.fontSize.body,
    color: theme.color.fg3,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 18,
    paddingRight: 14,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    borderRadius: theme.radius.pill,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
    ...theme.shadow.paper,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.font.ui,
    fontSize: 15,
    color: theme.color.fg1,
    paddingVertical: 12,
  },
  categories: {
    marginTop: 22,
    marginBottom: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: 18,
    rowGap: 14,
  },
  catBtn: { alignItems: 'center', gap: 8, width: 88 },
  catCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.paper,
  },
  catCircleActive: {
    backgroundColor: theme.palette.forest,
    borderColor: 'transparent',
  },
  catLabel: {
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.micro,
    color: theme.color.fg3,
    textAlign: 'center',
    lineHeight: 14,
  },
  catLabelActive: { color: theme.color.fg1, fontWeight: '700' },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: theme.font.display,
    fontSize: 20,
    color: theme.color.fg1,
  },
  sectionCount: {
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.micro,
    letterSpacing: 1.8,
    color: theme.color.fg3,
    fontWeight: '600',
  },
  empty: {
    paddingVertical: 40,
    textAlign: 'center',
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: theme.fontSize.bodyLg,
    color: theme.color.fg3,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', margin: -7 },

  // Card
  card: {
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    borderRadius: 12,
    overflow: 'hidden',
    ...theme.shadow.paper,
  },
  cardArt: { aspectRatio: 4 / 5 },
  art: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  flower: { width: '78%', height: '78%' },
  flowerLarge: { width: '85%', height: '85%' },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: theme.palette.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
  },
  newBadgeText: {
    fontFamily: theme.font.ui,
    fontSize: 9,
    letterSpacing: 1.6,
    color: theme.palette.cream,
    fontWeight: '700',
  },
  lockBadge: {
    position: 'absolute',
    bottom: 7,
    right: 7,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,253,246,0.90)',
    borderWidth: 1,
    borderColor: 'rgba(196,123,99,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: 12,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: theme.palette.hairlineSoft,
  },
  cardName: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    fontWeight: '600',
    color: theme.color.fg1,
  },
  cardFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pcs: {
    fontFamily: theme.font.ui,
    fontSize: 9,
    letterSpacing: 1.6,
    color: theme.color.fg3,
    fontWeight: '600',
  },

  // Tags
  priceTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#D6BD78',
    borderWidth: 1,
    borderColor: '#7E6322',
    borderRadius: theme.radius.pill,
  },
  priceText: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    fontWeight: '700',
    color: '#3A2C0F',
  },
  ownedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(78,102,82,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(78,102,82,0.42)',
    borderRadius: theme.radius.pill,
  },
  ownedText: {
    fontFamily: theme.font.ui,
    fontSize: 10,
    letterSpacing: 1.8,
    fontWeight: '700',
    color: theme.palette.forest,
  },
  freeTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(143,163,184,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(143,163,184,0.5)',
    borderRadius: theme.radius.pill,
  },
  freeText: {
    fontFamily: theme.font.ui,
    fontSize: 10,
    letterSpacing: 1.8,
    fontWeight: '700',
    color: theme.palette.dustyBlue,
  },
  studioTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(78,102,82,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(78,102,82,0.4)',
    borderRadius: theme.radius.pill,
  },
  studioTagText: {
    fontFamily: theme.font.ui,
    fontSize: 10,
    letterSpacing: 1.6,
    fontWeight: '700',
    color: theme.palette.forest,
  },

  // Studio banner
  studioBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.color.surface,
    borderWidth: 1.5,
    borderColor: theme.palette.forest,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 20,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
    ...theme.shadow.paper,
  },
  studioBannerActive: {
    borderColor: 'rgba(78,102,82,0.4)',
    backgroundColor: 'rgba(78,102,82,0.06)',
  },
  studioBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studioBannerText: { flex: 1 },
  studioBannerTitle: {
    fontFamily: theme.font.ui,
    fontSize: 15,
    fontWeight: '700',
    color: theme.color.fg1,
  },
  studioBannerSub: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    color: theme.color.fg3,
    marginTop: 2,
  },

  // Detail modal
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(43,42,40,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  detail: {
    flexDirection: 'row',
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    overflow: 'hidden',
    maxWidth: 640,
    width: '100%',
    minHeight: 320,
    ...theme.shadow.lift,
  },
  detailArt: { width: '42%' },
  detailBody: { flex: 1, padding: 22, gap: 8 },
  detailEyebrow: {
    fontFamily: theme.font.ui,
    fontSize: 10,
    letterSpacing: 2.2,
    color: theme.color.fg3,
    fontWeight: '600',
  },
  detailTitle: {
    fontFamily: theme.font.display,
    fontSize: theme.fontSize.h3,
    color: theme.color.fg1,
  },
  detailDesc: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    color: theme.color.fg2,
    lineHeight: 21,
  },
  detailPcs: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: 14,
    color: theme.color.fg3,
  },
  detailNote: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.fg3,
    marginTop: 4,
  },
  detailCtaCol: { alignItems: 'flex-end', gap: 6 },
  orStudio: {
    fontFamily: theme.font.ui,
    fontSize: 12,
    fontWeight: '600',
    color: theme.palette.forest,
  },
  detailFooter: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 14,
  },
  useBtn: {
    height: 44,
    paddingHorizontal: 22,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  useBtnText: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    fontWeight: '600',
    color: theme.color.fg1,
  },
  buyBtn: {
    height: 44,
    paddingHorizontal: 22,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.palette.terracotta,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...theme.shadow.paper,
  },
  buyBtnText: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    fontWeight: '700',
    color: theme.palette.cream,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,253,246,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
