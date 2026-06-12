import { create } from 'zustand';
import { SHOP_CATALOGUE, ShopItem } from '../data/shop';

/** Launch state drives where SCR-01 routes after the bar fills. */
export type LaunchState = 'new' | 'returning';

export interface Journal {
  id: string;
  name: string;
  items: number;
  edited: string;
  isNew?: boolean;
}

// Every journal is bound in cognac leather — cover selection was removed from
// the design, so the shelf reads as a matching leather set.
const SEED_JOURNALS: Journal[] = [
  { id: 'j-spring', name: 'Spring', items: 18, edited: '2 days ago' },
  { id: 'j-autumn', name: 'Autumn Library', items: 24, edited: 'yesterday' },
  { id: 'j-coastal', name: 'Coastal', items: 12, edited: '5 days ago' },
  { id: 'j-romantic', name: 'Romantic', items: 9, edited: '1 week ago' },
  { id: 'j-cottage', name: 'Cottagecore', items: 31, edited: '3 hours ago' },
  { id: 'j-fieldnotes', name: 'Field Notes', items: 7, edited: 'today' },
  { id: 'j-new', name: '', items: 0, edited: '', isNew: true },
];

interface AppState {
  launchState: LaunchState;
  journals: Journal[];
  ownedItems: Record<string, boolean>;
  shopItems: ShopItem[];
  /** Items just purchased and waiting to be "unwrapped" in the editor. */
  pendingDelivery: ShopItem[];
  setLaunchState: (s: LaunchState) => void;
  renameJournal: (id: string, name: string) => void;
  addJournal: () => Journal;
  purchaseItem: (id: string) => void;
  setShopItems: (items: ShopItem[]) => void;
  markItemOwned: (id: string) => void;
  queueDelivery: (item: ShopItem) => void;
  clearPendingDelivery: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  launchState: 'new',
  journals: SEED_JOURNALS,
  ownedItems: {},
  pendingDelivery: [],
  shopItems: SHOP_CATALOGUE,
  setLaunchState: (launchState) => set({ launchState }),
  renameJournal: (id, name) =>
    set((s) => ({
      journals: s.journals.map((j) => (j.id === id ? { ...j, name } : j)),
    })),
  addJournal: () => {
    const count = get().journals.filter((j) => !j.isNew).length;
    const journal: Journal = {
      id: `j-${Date.now()}`,
      name: `Journal ${count + 1}`,
      items: 0,
      edited: 'just now',
    };
    set((s) => {
      const rest = s.journals.filter((j) => !j.isNew);
      const slot = s.journals.find((j) => j.isNew);
      return { journals: slot ? [...rest, journal, slot] : [...rest, journal] };
    });
    return journal;
  },
  purchaseItem: (id) =>
    set((s) => ({ ownedItems: { ...s.ownedItems, [id]: true } })),
  setShopItems: (items) => set({ shopItems: items }),
  markItemOwned: (id) =>
    set((s) => ({
      ownedItems: { ...s.ownedItems, [id]: true },
      shopItems: s.shopItems.map((it) =>
        it.id === id ? { ...it, owned: true } : it
      ),
    })),
  queueDelivery: (item) =>
    set((s) => ({
      pendingDelivery: s.pendingDelivery.some((p) => p.id === item.id)
        ? s.pendingDelivery
        : [...s.pendingDelivery, item],
    })),
  clearPendingDelivery: () => set({ pendingDelivery: [] }),
}));
