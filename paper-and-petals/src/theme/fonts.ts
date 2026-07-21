import { useFonts } from 'expo-font';

/**
 * The brand faces plus the journalling text faces used by the editor's text
 * tool. Brand family names match `theme.font` tokens exactly — use
 * `fontFamily: theme.font.display` etc., never a literal string. The text-tool
 * faces are referenced through JOURNAL_FONTS below.
 *
 * A few faces are variable fonts (Ballet, Cormorant, NunitoSans); expo-font
 * loads them as a single static instance at their default axis, which is all
 * the text tool needs.
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
    IndieFlower: require('../../assets/fonts/IndieFlower-Regular.ttf'),
    RockSalt: require('../../assets/fonts/RockSalt-Regular.ttf'),
    Ballet: require('../../assets/fonts/Ballet-Regular-VariableFont_opsz.ttf'),
    LavishlyYours: require('../../assets/fonts/LavishlyYours-Regular.ttf'),
    LeagueScript: require('../../assets/fonts/LeagueScript-Regular.ttf'),
    CormorantGaramond: require('../../assets/fonts/CormorantGaramond-VariableFont_wght.ttf'),
    'CormorantGaramond-Italic': require('../../assets/fonts/CormorantGaramond-Italic-VariableFont_wght.ttf'),
    FacultyGlyphic: require('../../assets/fonts/FacultyGlyphic-Regular.ttf'),
    FascinateInline: require('../../assets/fonts/FascinateInline-Regular.ttf'),
    Metamorphous: require('../../assets/fonts/Metamorphous-Regular.ttf'),
  });
}

/** A warm roster of faces offered by the editor's text tool. */
export interface JournalFont {
  key: string;
  label: string;
  family: string;
}

export const JOURNAL_FONTS: JournalFont[] = [
  // Handwriting
  { key: 'caveat', label: 'Handwritten', family: 'Caveat' },
  { key: 'patrick', label: 'Print', family: 'PatrickHand' },
  { key: 'indie', label: 'Notebook', family: 'IndieFlower' },
  { key: 'rocksalt', label: 'Marker', family: 'RockSalt' },
  // Script / calligraphy
  { key: 'pinyon', label: 'Script', family: 'PinyonScript' },
  { key: 'ballet', label: 'Ballet', family: 'Ballet' },
  { key: 'lavish', label: 'Flourish', family: 'LavishlyYours' },
  { key: 'league', label: 'Signature', family: 'LeagueScript' },
  // Serif
  { key: 'spectral', label: 'Serif', family: 'Spectral' },
  { key: 'cormorant', label: 'Elegant', family: 'CormorantGaramond' },
  { key: 'cormorantItalic', label: 'Elegant Italic', family: 'CormorantGaramond-Italic' },
  { key: 'garamond', label: 'Italic', family: 'EBGaramond-Italic' },
  { key: 'faculty', label: 'Editorial', family: 'FacultyGlyphic' },
  // Typewriter / decorative
  { key: 'elite', label: 'Typewriter', family: 'SpecialElite' },
  { key: 'fascinate', label: 'Deco', family: 'FascinateInline' },
  { key: 'metamorphous', label: 'Storybook', family: 'Metamorphous' },
];

export function familyForFontKey(key?: string): string {
  return JOURNAL_FONTS.find((f) => f.key === key)?.family ?? JOURNAL_FONTS[0].family;
}
