// Journal cover art. Each cover is a background-removed PNG of a finished
// junk-journal front cover; the home shelf and the cover picker both read
// from this roster. Add a new cover by dropping the PNG into assets/covers/
// and appending an entry here.

export interface JournalCoverArt {
  key: string;
  label: string;
  source: number;
}

export const JOURNAL_COVERS: JournalCoverArt[] = [
  { key: 'botanical', label: 'Botanical', source: require('../../assets/covers/journal_botanical_no_background.png') },
  { key: 'meadow', label: 'Meadow', source: require('../../assets/covers/journal_meadow_no_background.png') },
  { key: 'pressedflowers', label: 'Pressed Flowers', source: require('../../assets/covers/journal_pressedflowers_no_background.png') },
  { key: 'lavender', label: 'Lavender', source: require('../../assets/covers/journal_lavender_no_background.png') },
  { key: 'autumn', label: 'Autumn', source: require('../../assets/covers/journal_autumn_no_background.png') },
  { key: 'cottage', label: 'Cottage', source: require('../../assets/covers/journal_cottage2_no_background.png') },
  { key: 'paris', label: 'Paris', source: require('../../assets/covers/journal_paris_no_background.png') },
  { key: 'paris2', label: 'Paris Nights', source: require('../../assets/covers/journal_paris2_no_background.png') },
  { key: 'linen', label: 'Linen', source: require('../../assets/covers/journal_linen_no_background.png') },
  { key: 'classic', label: 'Classic', source: require('../../assets/covers/journal_no_background.png') },
];

export function coverSource(key?: string): number | undefined {
  return JOURNAL_COVERS.find((c) => c.key === key)?.source;
}

/** A cover key chosen at random — used when a fresh journal has no pick yet. */
export function randomCoverKey(): string {
  return JOURNAL_COVERS[Math.floor(Math.random() * JOURNAL_COVERS.length)].key;
}
