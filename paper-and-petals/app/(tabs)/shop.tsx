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
  type ShopItem,
} from '../../src/data/shop';
import { fetchLiveItems, sanityItemToShopItem } from '../../src/services/content';

// SCR-06 Shop. Search bar at the top, wrapping centred category chips, then
// a grid of items. Tapping an item opens a detail panel with a large preview
// and either a price CTA or an "Owned" stamp.

// Same brand seal as Home (top-left there); the shop shows it top-right.
const logoSage = require('../../assets/logos/logo_sage.png');

export default function ShopScreen() {
  const router = useRouter();
  const ownedItems = useAppStore((s) => s.ownedItems);
  const purchaseItem = useAppStore((s) => s.purchaseItem);
  const shopItems = useAppStore((s) => s.shopItems);
  const setShopItems = useAppStore((s) => s.setShopItems);
  const subscribed = useAppStore((s) => s.subscribed);

  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [openItem, setOpenItem] = useState<ShopItem | null>(null);

  useEffect(() => {
    fetchLiveItems().then((results) => {
      if (results.length > 0) {
        setShopItems(results.map(sanityItemToShopItem));
      }
    });
  }, []);

  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 4 : width >= 640 ? 3 : 2;

  const isOwned = (it: ShopItem) => it.owned || !!ownedItems[it.id];

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
                  owned={isOwned(it)}
                  subscribed={subscribed}
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
        owned={openItem ? isOwned(openItem) : false}
        subscribed={subscribed}
        onClose={() => setOpenItem(null)}
        onPurchase={(it) => {
          if (!subscribed && it.price > 0) {
            Alert.alert(
              'Subscription item',
              'This item is included free with The Cottage subscription, or available to purchase individually.',
              [
                { text: 'Subscribe', onPress: () => { setOpenItem(null); router.push('/subscription'); } },
                { text: 'Buy individually', onPress: () => purchaseItem(it.id) },
                { text: 'Cancel', style: 'cancel' },
              ],
            );
          } else {
            purchaseItem(it.id);
          }
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

function PriceTag({ price, owned }: { price: number; owned: boolean }) {
  if (owned) {
    return (
      <View style={styles.ownedTag}>
        <Feather name="check" size={12} color={theme.palette.forest} />
        <Text style={styles.ownedText}>OWNED</Text>
      </View>
    );
  }
  return (
    <View style={styles.priceTag}>
      <Text style={styles.priceText}>${price.toFixed(2)}</Text>
    </View>
  );
}

function ItemCard({
  item,
  owned,
  subscribed,
  onOpen,
}: {
  item: ShopItem;
  owned: boolean;
  subscribed: boolean;
  onOpen: () => void;
}) {
  const showLock = !subscribed && item.price > 0 && !owned;
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
          <PriceTag price={item.price} owned={owned} />
          <Text style={styles.pcs}>{item.items} PCS</Text>
        </View>
      </View>
    </Pressable>
  );
}

function ItemDetail({
  item,
  owned,
  subscribed,
  onClose,
  onPurchase,
}: {
  item: ShopItem | null;
  owned: boolean;
  subscribed: boolean;
  onClose: () => void;
  onPurchase: (it: ShopItem) => void;
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
                <View style={styles.detailFooter}>
                  <PriceTag price={item.price} owned={owned} />
                  {owned ? (
                    <Pressable style={styles.useBtn} onPress={onClose}>
                      <Text style={styles.useBtnText}>Use in editor</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.buyBtn}
                      onPress={() => onPurchase(item)}
                    >
                      <Feather name="star" size={14} color={theme.palette.cream} />
                      <Text style={styles.buyBtnText}>Add to your collection</Text>
                    </Pressable>
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
