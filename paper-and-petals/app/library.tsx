import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { theme } from '../src/theme/theme';
import { useAppStore } from '../src/store/app';
import { SHOP_TONES, type Collection } from '../src/data/shop';
import { fetchCatalogue } from '../src/services/content';
import { screen, track } from '../src/lib/analytics';
import { downloadCollectionZip } from '../src/lib/downloads';
import { purchaseCollection } from '../src/lib/revenuecat';

// My library — collections the player owns outright (one-time purchases). This is
// the home for re-downloading the high-res print files. Subscription-only
// collections are intentionally NOT downloadable, so they don't appear here.

export default function LibraryScreen() {
  const router = useRouter();
  const ownedCollections = useAppStore((s) => s.ownedCollections);
  const hasStudio = useAppStore((s) => s.hasStudio);
  const markCollectionOwned = useAppStore((s) => s.markCollectionOwned);
  const queueDeliveryMany = useAppStore((s) => s.queueDeliveryMany);
  const shopItems = useAppStore((s) => s.shopItems);
  const collections = useAppStore((s) => s.collections);
  const setCollections = useAppStore((s) => s.setCollections);
  const setShopItems = useAppStore((s) => s.setShopItems);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  useEffect(() => {
    screen('Library');
    // Refresh so we have live collections (with print URLs) to download.
    fetchCatalogue().then(({ items, collections: cols }) => {
      if (items.length > 0) setShopItems(items);
      if (cols.length > 0) setCollections(cols);
    });
  }, []);

  const owned = useMemo(
    () => collections.filter((c) => ownedCollections[c.id]),
    [collections, ownedCollections],
  );

  // Collections a subscriber can use in-app but doesn't own outright — offered
  // here as "own it to download & print" (the perk Studio alone doesn't include).
  const studioOnly = useMemo(
    () => (hasStudio ? collections.filter((c) => !c.free && !ownedCollections[c.id]) : []),
    [collections, ownedCollections, hasStudio],
  );

  const resolveMembers = (c: Collection) =>
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

  const onBuyToOwn = (c: Collection) => {
    Alert.alert(
      'Own this collection',
      `${c.name} — $${c.price.toFixed(2)} one-time.\n\nIt stays yours forever (even if Studio ends), and you can download the high-res art for printing.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Buy for $${c.price.toFixed(2)}`,
          onPress: async () => {
            setBusyId(c.id);
            try {
              const ok = await purchaseCollection(c.id, c.productId);
              if (ok) {
                markCollectionOwned(c.id);
                queueDeliveryMany(resolveMembers(c));
                track('collection_purchased', { collectionId: c.id, price: c.price, source: 'library_upsell' });
              }
            } catch (e: any) {
              Alert.alert('Purchase unavailable', e?.message ?? 'Please try again in a moment.');
            } finally {
              setBusyId(null);
            }
          },
        },
      ],
    );
  };

  const runDownload = async (c: Collection) => {
    setBusyId(c.id);
    setProgress({ done: 0, total: c.items.length });
    try {
      await downloadCollectionZip(
        c.name,
        c.items.map((i) => ({ name: i.name, url: i.printUrl })),
        (done, total) => setProgress({ done, total }),
      );
      track('collection_downloaded', { collectionId: c.id });
    } catch (e: any) {
      Alert.alert('Download unavailable', e?.message ?? 'Please try again in a moment.');
    } finally {
      setBusyId(null);
    }
  };

  const onDownload = (c: Collection) => {
    Alert.alert(
      'Download for print',
      `${c.name} — ${c.pieceCount} pieces, saved as a zip you can open on a computer.\n\nFor your own personal use (printing, crafting). Please don’t resell or share the files.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => runDownload(c) },
      ],
    );
  };

  return (
    <Screen>
      <View style={styles.topbar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={theme.color.fg1} />
        </Pressable>
        <View style={styles.topTitle}>
          <Text style={styles.topTitleSerif}>My </Text>
          <Text style={styles.topTitleScript}>library</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.intro}>
          Collections you’ve bought are yours to keep — download the high-resolution art to
          print and use in hardcopy.
        </Text>

        {owned.length === 0 && studioOnly.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="download-cloud" size={32} color={theme.color.fg4} />
            <Text style={styles.emptyTitle}>No collections to download yet</Text>
            <Text style={styles.emptyBody}>
              Buy a collection outright and its print files appear here. (Studio unlocks
              collections in the app, but downloads are a perk of owning a collection.)
            </Text>
            <Pressable style={styles.shopBtn} onPress={() => router.push('/(tabs)/shop')}>
              <Feather name="shopping-bag" size={15} color={theme.palette.cream} />
              <Text style={styles.shopBtnText}>Browse the shop</Text>
            </Pressable>
          </View>
        ) : (
          owned.map((c) => {
            const busy = busyId === c.id;
            return (
              <View key={c.id} style={styles.card}>
                <CollectionThumb collection={c} />
                <View style={styles.cardBody}>
                  <Text style={styles.cardName} numberOfLines={1}>{c.name}</Text>
                  <Text style={styles.cardMeta}>{c.pieceCount} pieces</Text>
                </View>
                <Pressable
                  style={[styles.dlBtn, busy && styles.dlBtnBusy]}
                  onPress={() => onDownload(c)}
                  disabled={busy || busyId !== null}
                >
                  {busy ? (
                    <>
                      <ActivityIndicator size="small" color={theme.palette.forest} />
                      <Text style={styles.dlBusyText}>
                        {progress.total ? `${progress.done}/${progress.total}` : 'Preparing…'}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Feather name="download" size={15} color={theme.palette.cream} />
                      <Text style={styles.dlText}>Download</Text>
                    </>
                  )}
                </Pressable>
              </View>
            );
          })
        )}

        {/* Studio-unlocked collections — usable in-app already; owning adds
            keep-forever + print download. */}
        {studioOnly.length > 0 && (
          <>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Included with Studio</Text>
              <Text style={styles.sectionSub}>
                You can use these in your journals now. Own one outright to keep it forever and
                download the art for printing.
              </Text>
            </View>
            {studioOnly.map((c) => {
              const busy = busyId === c.id;
              return (
                <View key={c.id} style={styles.card}>
                  <CollectionThumb collection={c} />
                  <View style={styles.cardBody}>
                    <Text style={styles.cardName} numberOfLines={1}>{c.name}</Text>
                    <Text style={styles.cardMeta}>{c.pieceCount} pieces · in Studio</Text>
                  </View>
                  <Pressable
                    style={[styles.ownBtn, busy && styles.dlBtnBusy]}
                    onPress={() => onBuyToOwn(c)}
                    disabled={busy || busyId !== null}
                  >
                    {busy ? (
                      <ActivityIndicator size="small" color={theme.palette.forest} />
                    ) : (
                      <>
                        <Feather name="download" size={14} color={theme.palette.forest} />
                        <Text style={styles.ownBtnText}>Own · ${c.price.toFixed(2)}</Text>
                      </>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function CollectionThumb({ collection }: { collection: Collection }) {
  const tone = SHOP_TONES[collection.palette] ?? SHOP_TONES.sage;
  if (collection.cover) {
    return (
      <View style={[styles.thumb, { backgroundColor: theme.palette.cream }]}>
        <Image source={collection.cover} style={styles.thumbImg} resizeMode="contain" />
      </View>
    );
  }
  return (
    <View style={[styles.thumb, { backgroundColor: tone.bg }]}>
      <Feather name="package" size={26} color={tone.accent} />
    </View>
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
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  intro: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    color: theme.color.fg2,
    lineHeight: 21,
    marginTop: 4,
    marginBottom: 18,
  },
  empty: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontFamily: theme.font.display,
    fontSize: 18,
    color: theme.color.fg1,
    marginTop: 4,
  },
  emptyBody: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    color: theme.color.fg3,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 380,
  },
  shopBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 20,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.palette.terracotta,
    ...theme.shadow.paper,
  },
  shopBtnText: { fontFamily: theme.font.ui, fontSize: 14, fontWeight: '700', color: theme.palette.cream },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    ...theme.shadow.paper,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: { width: '86%', height: '86%' },
  cardBody: { flex: 1, gap: 3 },
  cardName: { fontFamily: theme.font.ui, fontSize: 15, fontWeight: '700', color: theme.color.fg1 },
  cardMeta: { fontFamily: theme.font.ui, fontSize: 12, color: theme.color.fg3 },
  dlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    minWidth: 120,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.palette.forest,
  },
  dlBtnBusy: {
    backgroundColor: 'rgba(78,102,82,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(78,102,82,0.4)',
  },
  dlText: { fontFamily: theme.font.ui, fontSize: 14, fontWeight: '700', color: theme.palette.cream },
  dlBusyText: { fontFamily: theme.font.ui, fontSize: 13, fontWeight: '600', color: theme.palette.forest },

  sectionHead: { marginTop: 22, marginBottom: 12, gap: 4 },
  sectionTitle: { fontFamily: theme.font.display, fontSize: 19, color: theme.color.fg1 },
  sectionSub: { fontFamily: theme.font.ui, fontSize: 13, lineHeight: 19, color: theme.color.fg3 },
  ownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 120,
    height: 42,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(78,102,82,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(78,102,82,0.42)',
  },
  ownBtnText: { fontFamily: theme.font.ui, fontSize: 13, fontWeight: '700', color: theme.palette.forest },
});
