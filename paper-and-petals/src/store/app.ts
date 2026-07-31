import { create } from 'zustand';
import { SHOP_CATALOGUE, FALLBACK_COLLECTIONS, ShopItem, Collection } from '../data/shop';
import { randomCoverKey } from '../data/covers';
import { Upload, loadUploads, persistUploads } from '../lib/uploads';

/** Launch state drives where SCR-01 routes after the bar fills. */
export type LaunchState = 'new' | 'returning';

export interface Journal {
  id: string;
  name: string;
  items: number;
  edited: string;
  /** Cover art key (see JOURNAL_COVERS); undefined falls back to leather. */
  coverKey?: string;
  isNew?: boolean;
}

// First run starts with a single journal wearing a random cover; the user
// adds more and picks a cover for each. The trailing slot is the "add" card.
const SEED_JOURNALS: Journal[] = [
  { id: 'j-first', name: 'My Journal', items: 0, edited: 'just now', coverKey: randomCoverKey() },
  { id: 'j-new', name: '', items: 0, edited: '', isNew: true },
];

interface AppState {
  launchState: LaunchState;
  journals: Journal[];
  /** Collections the player has bought one-time (owned forever). */
  ownedCollections: Record<string, boolean>;
  /**
   * Items bought one-time under the *old* per-item model. Kept only so existing
   * buyers never lose what they paid for — never written to by new purchases.
   */
  legacyOwnedItems: Record<string, boolean>;
  /** True while the player has an active Studio subscription. */
  hasStudio: boolean;
  shopItems: ShopItem[];
  collections: Collection[];
  /** Items just purchased and waiting to be "unwrapped" in the editor. */
  pendingDelivery: ShopItem[];
  /** Most-recently placed item ids, newest first (capped). */
  recentItemIds: string[];
  /**
   * The user's own imported files. Not shop content: no category, rarity or
   * ownership — a plain holding area, global across every journal and spread.
   */
  uploads: Upload[];
  setLaunchState: (s: LaunchState) => void;
  renameJournal: (id: string, name: string) => void;
  addJournal: (coverKey?: string) => Journal;
  setShopItems: (items: ShopItem[]) => void;
  setCollections: (collections: Collection[]) => void;
  /** Record a collection as owned (after a successful purchase). */
  markCollectionOwned: (id: string) => void;
  setHasStudio: (v: boolean) => void;
  /** Mark several collections owned at once (restore / boot sync). */
  setOwnedCollectionIds: (ids: string[]) => void;
  /** Record legacy one-time item purchases for grandfathering. */
  setLegacyOwnedItemIds: (ids: string[]) => void;
  queueDelivery: (item: ShopItem) => void;
  queueDeliveryMany: (items: ShopItem[]) => void;
  clearPendingDelivery: () => void;
  noteRecentItem: (id: string) => void;
  /** Replace the whole uploads list (used by disk hydration). */
  setUploads: (list: Upload[]) => void;
  /** Add one imported file to the holding area (newest first). */
  addUpload: (upload: Upload) => void;
  /** Remove a file from the holding area (does not touch already-placed copies). */
  removeUpload: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  launchState: 'new',
  journals: SEED_JOURNALS,
  ownedCollections: {},
  legacyOwnedItems: {},
  hasStudio: false,
  pendingDelivery: [],
  recentItemIds: [],
  uploads: [],
  shopItems: SHOP_CATALOGUE,
  collections: FALLBACK_COLLECTIONS,
  setLaunchState: (launchState) => set({ launchState }),
  renameJournal: (id, name) =>
    set((s) => ({
      journals: s.journals.map((j) => (j.id === id ? { ...j, name } : j)),
    })),
  addJournal: (coverKey) => {
    const count = get().journals.filter((j) => !j.isNew).length;
    const journal: Journal = {
      id: `j-${Date.now()}`,
      name: `Journal ${count + 1}`,
      items: 0,
      edited: 'just now',
      coverKey: coverKey ?? randomCoverKey(),
    };
    set((s) => {
      const rest = s.journals.filter((j) => !j.isNew);
      const slot = s.journals.find((j) => j.isNew);
      return { journals: slot ? [...rest, journal, slot] : [...rest, journal] };
    });
    return journal;
  },
  setShopItems: (items) => set({ shopItems: items }),
  setCollections: (collections) => set({ collections }),
  markCollectionOwned: (id) =>
    set((s) => ({ ownedCollections: { ...s.ownedCollections, [id]: true } })),
  setHasStudio: (hasStudio) => set({ hasStudio }),
  setOwnedCollectionIds: (ids) =>
    set((s) => {
      const owned = { ...s.ownedCollections };
      ids.forEach((id) => {
        owned[id] = true;
      });
      return { ownedCollections: owned };
    }),
  setLegacyOwnedItemIds: (ids) =>
    set((s) => {
      const owned = { ...s.legacyOwnedItems };
      ids.forEach((id) => {
        owned[id] = true;
      });
      return { legacyOwnedItems: owned };
    }),
  queueDelivery: (item) =>
    set((s) => ({
      pendingDelivery: s.pendingDelivery.some((p) => p.id === item.id)
        ? s.pendingDelivery
        : [...s.pendingDelivery, item],
    })),
  queueDeliveryMany: (items) =>
    set((s) => {
      const seen = new Set(s.pendingDelivery.map((p) => p.id));
      const fresh = items.filter((it) => !seen.has(it.id));
      return { pendingDelivery: [...s.pendingDelivery, ...fresh] };
    }),
  clearPendingDelivery: () => set({ pendingDelivery: [] }),
  noteRecentItem: (id) =>
    set((s) => ({
      recentItemIds: [id, ...s.recentItemIds.filter((r) => r !== id)].slice(0, 16),
    })),
  setUploads: (uploads) => set({ uploads }),
  addUpload: (upload) =>
    set((s) => {
      const uploads = [upload, ...s.uploads];
      // Write through so the holding area survives across sessions.
      void persistUploads(uploads);
      return { uploads };
    }),
  removeUpload: (id) =>
    set((s) => {
      const uploads = s.uploads.filter((u) => u.id !== id);
      void persistUploads(uploads);
      return { uploads };
    }),
}));

// Hydrate the holding area from disk once, on first import of the store.
void loadUploads().then((list) => {
  if (list.length) useAppStore.setState({ uploads: list });
});
