import { useFonts } from 'expo-font';

/**
 * The four brand faces. Family names match `theme.font` tokens exactly —
 * use `fontFamily: theme.font.display` etc., never a literal string.
 */
export function usePPFonts() {
  return useFonts({
    Spectral: require('../../assets/fonts/Spectral-Regular.ttf'),
    NunitoSans: require('../../assets/fonts/NunitoSans-Variable.ttf'),
    'EBGaramond-Italic': require('../../assets/fonts/EBGaramond-Italic.ttf'),
    PinyonScript: require('../../assets/fonts/PinyonScript-Regular.ttf'),
  });
}
