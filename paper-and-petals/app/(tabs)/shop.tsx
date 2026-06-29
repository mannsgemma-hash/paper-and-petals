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
  type Collection,
  type CollectionItemRef,
} from '../../src/data/shop';
import { fetchCatalogue } from '../../src/services/content';
import { screen, track } from '../../src/lib/analytics';
import { purchaseCollection } from '../../src/lib/revenuecat';

// SCR-06 Shop. Collection-first (bundles only): a grid of collection cards is the
// primary browse, with a free-items area below filtered by the category chips.
// Tapping a collection opens a detail panel (cover, Buy + price / Owned /
// Included with Studio, "what you get", and a gallery of its member pieces).

const logoSage = require('../../assets/logos/logo_sage.png');

type CollectionStatus = 'free' | 'owned' | 'studio' | 'buy';

export default function ShopScreen() {
  const router = useRouter();
  const ownedCollections = useAppStore((s) => s.ownedCollections);
  const hasStudio = useAppStore((s) => s.hasStudio);
  const markCollectionOwned = useAppStore((s) => s.markCollectionOwned);
  const queueDeliveryMany = useAppStore((s) => s.queueDeliveryMany);
  const shopItems = useAppStore((s) => s.shopItems);
  const collections = useAppStore((s) => s.collections);
  const setShopItems = useAppStore((s) => s.setShopItems);
  const setCollections = useAppStore((s) => s.setCollections);
  const [purchasing, setPurchasing] = useState(false);

  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [openCollection, setOpenCollection] = useState<Collection | null>(null);
  const [openItem, setOpenItem] = useState<ShopItem | null>(null);

  useEffect(() => {
    screen('Shop');
    fetchCatalogue().then(({ items, collections: cols }) => {
      if (items.length > 0) setShopItems(items);
      if (cols.length > 0) setCollections(cols);
    });
  }, []);

  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 4 : width >= 640 ? 3 : 2;
  const colColumns = width >= 900 ? 3 : 2;
  const narrowDetail = width < 680;

  const statusFor = (c: Collection): CollectionStatus =>
    c.free ? 'free' : ownedCollections[c.id] ? 'owned' : hasStudio ? 'studio' : 'buy';

  const q = query.trim().toLowerCase();

  const visibleCollections = useMemo(
    () => collections.filter((c) => !q || c.name.toLowerCase().includes(q)),
    [collections, q],
  );

  const freeItems = useMemo(
    () =>
      shopItems.filter(
        (it) =>
          it.free &&
          (category === 'all' || it.category === category) &&
          (!q || it.name.toLowerCase().includes(q)),
      ),
    [shopItems, category, q],
  );

  // Resolve a collection's member refs to full ShopItems for the delivery ritual.
  const resolveMembers = (c: Collection): ShopItem[] =>
    c.items.map(
      (ref) =>
        shopItems.find((s) => s.id === ref.id) ?? {
          id: ref.id,
          category: ref.category,
          name: ref.name,
          tone: ref.tone,
          glyph: ref.glyph,
          flowerAsset: ref.flowerAsset,
          desc: '',
          free: false,
          collectionIds: [c.id],
          isNew: false,
        },
    );

  const handleBuy = async (c: Collection) => {
    setPurchasing(true);
    try {
      const ok = await purchaseCollection(c.id);
      if (ok) {
        markCollectionOwned(c.id);
        queueDeliveryMany(resolveMembers(c));
        track('collection_purchased', { collectionId: c.id, price: c.price });
        setOpenCollection(null);
        Alert.alert(
          'Added to your shelf',
          `${c.name} is yours — open a journal to watch the pieces arrive.`,
        );
      }
    } catch (e: any) {
      Alert.alert('Purchase unavailable', e.message ?? 'Please try again in a moment.');
    } finally {
      setPurchasing(false);
    }
  };

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
        <Text style={styles.heroSub}>Curated collections of papers, stickers, and treasures.</Text>

        {/* Studio banner — the route to the whole catalogue */}
        {!hasStudio ? (
          <Pressable style={styles.studioBanner} onPress={() => router.push('/studio')}>
            <View style={styles.studioBannerIcon}>
              <Feather name="package" size={20} color={theme.palette.cream} />
            </View>
            <View style={styles.studioBannerText}>
              <Text style={styles.studioBannerTitle}>Unlock every collection with Studio</Text>
              <Text style={styles.studioBannerSub}>
                The whole living library + new collections every week. 7 days free.
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
                Every collection below is unlocked — place anything you like.
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
            placeholder="Search collections and free pieces…"
            placeholderTextColor={theme.color.fg4}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Feather name="x" size={16} color={theme.color.fg3} />
            </Pressable>
          )}
        </View>

        {/* ── Collections ─────────────────────────────────────────────── */}
        <View style={[styles.sectionRow, { marginTop: 26 }]}>
          <Text style={styles.sectionTitle}>Collections</Text>
          <Text style={styles.sectionCount}>{visibleCollections.length} BUNDLES</Text>
        </View>
        {visibleCollections.length === 0 ? (
          <Text style={styles.empty}>No collections match that yet.</Text>
        ) : (
          <View style={styles.grid}>
            {visibleCollections.map((c) => (
              <View key={c.id} style={{ width: `${100 / colColumns}%` as const, padding: 7 }}>
                <CollectionCard
                  collection={c}
                  status={statusFor(c)}
                  onOpen={() => setOpenCollection(c)}
                />
              </View>
            ))}
          </View>
        )}

        {/* ── Free to use ─────────────────────────────────────────────── */}
        <View style={[styles.sectionRow, { marginTop: 30 }]}>
          <Text style={styles.sectionTitle}>Free to use</Text>
          <Text style={styles.sectionCount}>{freeItems.length} ITEMS</Text>
        </View>

        {/* Category chips filter the free pieces */}
        <View style={styles.categories}>
          {SHOP_CATEGORIES.map((c) => {
            const isActive = c.id === category;
            return (
              <Pressable key={c.id} style={styles.catBtn} onPress={() => setCategory(c.id)}>
                <View style={[styles.catCircle, isActive && styles.catCircleActive]}>
                  <Feather
                    name={c.icon}
                    size={22}
                    color={isActive ? theme.palette.cream : theme.color.fg1}
                  />
                </View>
                <Text style={[styles.catLabel, isActive && styles.catLabelActive]}>{c.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {freeItems.length === 0 ? (
          <Text style={styles.empty}>No free pieces in this category yet.</Text>
        ) : (
          <View style={styles.grid}>
            {freeItems.map((it) => (
              <View key={it.id} style={{ width: `${100 / columns}%` as const, padding: 7 }}>
                <FreeItemCard item={it} onOpen={() => setOpenItem(it)} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Collection detail modal */}
      <CollectionDetail
        collection={openCollection}
        status={openCollection ? statusFor(openCollection) : 'buy'}
        purchasing={purchasing}
        narrow={narrowDetail}
        onClose={() => setOpenCollection(null)}
        onBuy={handleBuy}
        onUnlockStudio={() => {
          setOpenCollection(null);
          router.push('/studio');
        }}
      />

      {/* Free item preview modal */}
      <FreeItemDetail item={openItem} onClose={() => setOpenItem(null)} />
    </Screen>
  );
}

// ─── Art ────────────────────────────────────────────────────────────────────────

function ItemArt({ item, large }: { item: ShopItem; large?: boolean }) {
  const tone = SHOP_TONES[item.tone] ?? SHOP_TONES.sage;
  if (item.flowerAsset) {
    return (
      <View style={[styles.art, { backgroundColor: theme.palette.cream }]}>
        <Image source={item.flowerAsset} style={large ? styles.flowerLarge : styles.flower} resizeMode="contain" />
      </View>
    );
  }
  return (
    <View style={[styles.art, { backgroundColor: tone.bg }]}>
      <Feather name={item.glyph} size={large ? 72 : 40} color={tone.accent} />
    </View>
  );
}

/** Collection cover — the Sanity cover image, or a tinted collage of member icons. */
function CollectionArt({ collection, large }: { collection: Collection; large?: boolean }) {
  const tone = SHOP_TONES[collection.palette] ?? SHOP_TONES.sage;
  if (collection.cover) {
    return (
      <View style={[styles.art, { backgroundColor: theme.palette.cream }]}>
        <Image source={collection.cover} style={large ? styles.flowerLarge : styles.flower} resizeMode="contain" />
      </View>
    );
  }
  const members = collection.items.slice(0, 4);
  return (
    <View style={[styles.art, styles.collage, { backgroundColor: tone.bg }]}>
      {members.map((m, i) => (
        <View key={m.id + i} style={styles.collageCell}>
          {m.flowerAsset ? (
            <Image source={m.flowerAsset} style={styles.collageImg} resizeMode="contain" />
          ) : (
            <Feather name={m.glyph} size={large ? 34 : 22} color={tone.accent} />
          )}
        </View>
      ))}
    </View>
  );
}

function GalleryArt({ item }: { item: CollectionItemRef }) {
  const tone = SHOP_TONES[item.tone] ?? SHOP_TONES.sage;
  if (item.flowerAsset) {
    return (
      <View style={[styles.galleryArt, { backgroundColor: theme.palette.cream }]}>
        <Image source={item.flowerAsset} style={styles.galleryImg} resizeMode="contain" />
      </View>
    );
  }
  return (
    <View style={[styles.galleryArt, { backgroundColor: tone.bg }]}>
      <Feather name={item.glyph} size={26} color={tone.accent} />
    </View>
  );
}

// ─── Cards ───────────────────────────────────────────────────────────────────────

function CollectionStatusPill({ status, price }: { status: CollectionStatus; price: number }) {
  if (status === 'free') {
    return (
      <View style={styles.freeTag}>
        <Text style={styles.freeText}>FREE</Text>
      </View>
    );
  }
  if (status === 'owned') {
    return (
      <View style={styles.ownedTag}>
        <Feather name="check" size={12} color={theme.palette.forest} />
        <Text style={styles.ownedText}>OWNED</Text>
      </View>
    );
  }
  if (status === 'studio') {
    return (
      <View style={styles.studioTag}>
        <Feather name="package" size={11} color={theme.palette.forest} />
        <Text style={styles.studioTagText}>STUDIO</Text>
      </View>
    );
  }
  return (
    <View style={styles.priceTag}>
      <Text style={styles.priceText}>${price.toFixed(2)}</Text>
    </View>
  );
}

function CollectionCard({
  collection,
  status,
  onOpen,
}: {
  collection: Collection;
  status: CollectionStatus;
  onOpen: () => void;
}) {
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.97 }] }]}
    >
      <View style={styles.cardArt}>
        <CollectionArt collection={collection} />
        {collection.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>
          {collection.name}
        </Text>
        <View style={styles.cardFoot}>
          <CollectionStatusPill status={status} price={collection.price} />
          <Text style={styles.pcs}>{collection.pieceCount} PCS</Text>
        </View>
      </View>
    </Pressable>
  );
}

function FreeItemCard({ item, onOpen }: { item: ShopItem; onOpen: () => void }) {
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
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.cardFoot}>
          <View style={styles.freeTag}>
            <Text style={styles.freeText}>FREE</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Modals ──────────────────────────────────────────────────────────────────────

function CollectionDetail({
  collection,
  status,
  purchasing,
  narrow,
  onClose,
  onBuy,
  onUnlockStudio,
}: {
  collection: Collection | null;
  status: CollectionStatus;
  purchasing: boolean;
  narrow: boolean;
  onClose: () => void;
  onBuy: (c: Collection) => void;
  onUnlockStudio: () => void;
}) {
  // Member breakdown by category, e.g. "5 papers · 2 stickers".
  const breakdown = useMemo(() => {
    if (!collection) return [] as { label: string; count: number }[];
    const counts: Record<string, number> = {};
    collection.items.forEach((m) => {
      counts[m.category] = (counts[m.category] ?? 0) + 1;
    });
    return Object.entries(counts).map(([cat, count]) => ({
      label: (SHOP_CATEGORIES.find((c) => c.id === cat)?.label ?? cat).toLowerCase(),
      count,
    }));
  }, [collection]);

  return (
    <Modal visible={!!collection} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={[styles.detailLg, narrow && styles.detailLgNarrow]} onPress={() => {}}>
          {collection && (
            <>
              {/* Left info panel */}
              <View style={[styles.colInfo, narrow && styles.colInfoNarrow]}>
                <View style={styles.colThumb}>
                  <CollectionArt collection={collection} />
                </View>

                {status === 'buy' ? (
                  <View style={styles.colCta}>
                    <Pressable
                      style={[styles.buyGreen, purchasing && { opacity: 0.6 }]}
                      onPress={() => onBuy(collection)}
                      disabled={purchasing}
                    >
                      <Text style={styles.buyGreenText}>{purchasing ? 'Adding…' : 'Buy'}</Text>
                    </Pressable>
                    <Text style={styles.colPrice}>${collection.price.toFixed(2)}</Text>
                    <Pressable onPress={onUnlockStudio} hitSlop={6}>
                      <Text style={styles.orStudio}>or unlock all with Studio</Text>
                    </Pressable>
                  </View>
                ) : status === 'owned' ? (
                  <View style={styles.ownedTag}>
                    <Feather name="check" size={13} color={theme.palette.forest} />
                    <Text style={styles.ownedText}>OWNED</Text>
                  </View>
                ) : status === 'studio' ? (
                  <View style={styles.studioTag}>
                    <Feather name="package" size={12} color={theme.palette.forest} />
                    <Text style={styles.studioTagText}>INCLUDED WITH STUDIO</Text>
                  </View>
                ) : (
                  <View style={styles.freeTag}>
                    <Text style={styles.freeText}>FREE</Text>
                  </View>
                )}

                <Text style={styles.colName}>{collection.name}</Text>
                <View style={styles.colStatRow}>
                  <Feather name="layers" size={13} color={theme.color.fg3} />
                  <Text style={styles.colStat}>{collection.pieceCount} pieces</Text>
                </View>

                {!!collection.whatYouGet && (
                  <>
                    <Text style={styles.whatYouGetLabel}>What you get</Text>
                    <Text style={styles.detailDesc}>{collection.whatYouGet}</Text>
                  </>
                )}
                {breakdown.length > 0 && (
                  <View style={styles.breakdown}>
                    {breakdown.map((b) => (
                      <Text key={b.label} style={styles.breakdownLine}>
                        · {b.count} {b.label}
                      </Text>
                    ))}
                  </View>
                )}
              </View>

              {/* Right showcase: hero + member gallery */}
              <ScrollView style={styles.colShowcase} contentContainerStyle={styles.colShowcaseInner}>
                <View style={styles.colHero}>
                  <CollectionArt collection={collection} large />
                </View>
                <View style={styles.galleryWrap}>
                  {collection.items.map((m) => (
                    <View key={m.id} style={styles.galleryCell}>
                      <GalleryArt item={m} />
                    </View>
                  ))}
                </View>
              </ScrollView>

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

function FreeItemDetail({ item, onClose }: { item: ShopItem | null; onClose: () => void }) {
  const categoryLabel = item ? SHOP_CATEGORIES.find((c) => c.id === item.category)?.label : '';
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
                <Text style={styles.detailEyebrow}>{categoryLabel?.toUpperCase()}</Text>
                <Text style={styles.detailTitle}>{item.name}</Text>
                <Text style={styles.detailDesc}>{item.desc}</Text>
                <Text style={styles.detailNote}>Part of the free starter set — use it in any journal.</Text>
                <View style={styles.detailFooter}>
                  <View style={styles.freeTag}>
                    <Text style={styles.freeText}>FREE</Text>
                  </View>
                  <Pressable style={styles.useBtn} onPress={onClose}>
                    <Text style={styles.useBtnText}>Close</Text>
                  </Pressable>
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
  topTitleSerif: { fontFamily: theme.font.display, fontSize: 22, color: theme.color.fg1 },
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
    marginTop: 6,
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
  catCircleActive: { backgroundColor: theme.palette.forest, borderColor: 'transparent' },
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
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: { fontFamily: theme.font.display, fontSize: 20, color: theme.color.fg1 },
  sectionCount: {
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.micro,
    letterSpacing: 1.8,
    color: theme.color.fg3,
    fontWeight: '600',
  },
  empty: {
    paddingVertical: 30,
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
  collage: { flexDirection: 'row', flexWrap: 'wrap', padding: 6 },
  collageCell: { width: '50%', height: '50%', alignItems: 'center', justifyContent: 'center' },
  collageImg: { width: '74%', height: '74%' },
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
  cardBody: {
    padding: 12,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: theme.palette.hairlineSoft,
  },
  cardName: { fontFamily: theme.font.ui, fontSize: 14, fontWeight: '600', color: theme.color.fg1 },
  cardFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  priceText: { fontFamily: theme.font.ui, fontSize: 13, fontWeight: '700', color: '#3A2C0F' },
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
    alignSelf: 'flex-start',
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
    alignSelf: 'flex-start',
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
    alignSelf: 'flex-start',
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
    marginBottom: 4,
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
  studioBannerTitle: { fontFamily: theme.font.ui, fontSize: 15, fontWeight: '700', color: theme.color.fg1 },
  studioBannerSub: { fontFamily: theme.font.ui, fontSize: 13, color: theme.color.fg3, marginTop: 2 },

  // Detail modals
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(43,42,40,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  // Free-item detail (small)
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
  detailTitle: { fontFamily: theme.font.display, fontSize: theme.fontSize.h3, color: theme.color.fg1 },
  detailDesc: { fontFamily: theme.font.ui, fontSize: 14, color: theme.color.fg2, lineHeight: 21 },
  detailNote: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.fg3,
    marginTop: 4,
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
  useBtnText: { fontFamily: theme.font.ui, fontSize: 14, fontWeight: '600', color: theme.color.fg1 },

  // Collection detail (large, two-pane)
  detailLg: {
    flexDirection: 'row',
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    overflow: 'hidden',
    maxWidth: 780,
    width: '100%',
    maxHeight: '88%',
    ...theme.shadow.lift,
  },
  detailLgNarrow: { flexDirection: 'column' },
  colInfo: {
    width: '38%',
    padding: 22,
    gap: 8,
    borderRightWidth: 1,
    borderRightColor: theme.palette.hairlineSoft,
  },
  colInfoNarrow: { width: '100%', borderRightWidth: 0, borderBottomWidth: 1, borderBottomColor: theme.palette.hairlineSoft },
  colThumb: {
    width: 76,
    height: 76,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.palette.hairlineSoft,
    marginBottom: 4,
  },
  colCta: { gap: 4, alignItems: 'flex-start' },
  buyGreen: {
    height: 40,
    paddingHorizontal: 26,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.paper,
  },
  buyGreenText: { fontFamily: theme.font.ui, fontSize: 15, fontWeight: '700', color: theme.palette.cream },
  colPrice: {
    fontFamily: theme.font.ui,
    fontSize: 18,
    fontWeight: '700',
    color: theme.palette.forest,
    marginTop: 2,
  },
  orStudio: { fontFamily: theme.font.ui, fontSize: 12, fontWeight: '600', color: theme.palette.forest },
  colName: { fontFamily: theme.font.display, fontSize: theme.fontSize.h3, color: theme.color.fg1, marginTop: 4 },
  colStatRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  colStat: { fontFamily: theme.font.ui, fontSize: 13, color: theme.color.fg3, fontWeight: '600' },
  whatYouGetLabel: {
    fontFamily: theme.font.ui,
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: '700',
    color: theme.color.fg2,
    marginTop: 8,
  },
  breakdown: { marginTop: 4, gap: 2 },
  breakdownLine: { fontFamily: theme.font.ui, fontSize: 13, color: theme.color.fg3, lineHeight: 19 },
  colShowcase: { flex: 1 },
  colShowcaseInner: { padding: 16, gap: 14 },
  colHero: {
    aspectRatio: 16 / 10,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: theme.color.bg1,
  },
  galleryWrap: { flexDirection: 'row', flexWrap: 'wrap', margin: -5 },
  galleryCell: { width: '25%', padding: 5 },
  galleryArt: {
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  galleryImg: { width: '78%', height: '78%' },

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
