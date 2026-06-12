import { useFonts } from 'expo-font';

/**
 * The four brand faces plus the journalling text faces used by the editor's
 * text tool. Brand family names match `theme.font` tokens exactly — use
 * `fontFamily: theme.font.display` etc., never a literal string. The text-tool
 * faces are referenced through JOURNAL_FONTS below.
 */
export function usePPFonts() {
  return useFonts({
    // Brand faces
    Spectral: require('../../assets/fonts/Spectral-Regular.ttf'),
    NunitoSans: require('../../assets/fonts/NunitoSans-Variable.ttf'),
    'EBGaramond-Italic': require('../../assets/fonts/EBGaramond-Italic.ttf'),
    PinyonScript: require('../../assets/fonts/PinyonScript-Regular.ttf'),
    // Journalling text-tool faces
    Caveat: require('../../assets/fonts/Caveat-Regular.ttf'),
    PatrickHand: require('../../assets/fonts/PatrickHand-Regular.ttf'),
    SpecialElite: require('../../assets/fonts/SpecialElite-Regular.ttf'),
  });
}

/** A warm roster of faces offered by the editor's text tool. */
export interface JournalFont {
  key: string;
  label: string;
  family: string;
}

export const JOURNAL_FONTS: JournalFont[] = [
  { key: 'caveat', label: 'Handwritten', family: 'Caveat' },
  { key: 'patrick', label: 'Print', family: 'PatrickHand' },
  { key: 'pinyon', label: 'Script', family: 'PinyonScript' },
  { key: 'spectral', label: 'Serif', family: 'Spectral' },
  { key: 'garamond', label: 'Italic', family: 'EBGaramond-Italic' },
  { key: 'elite', label: 'Typewriter', family: 'SpecialElite' },
];

export function familyForFontKey(key?: string): string {
  return JOURNAL_FONTS.find((f) => f.key === key)?.family ?? JOURNAL_FONTS[0].family;
}
