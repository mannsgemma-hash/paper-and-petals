import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme/theme';

// ─── colour maths ──────────────────────────────────────────────────────────────
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = (hex || '').replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return null;
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g] = [c, x];
  else if (h < 120) [r, g] = [x, c];
  else if (h < 180) [g, b] = [c, x];
  else if (h < 240) [g, b] = [x, c];
  else if (h < 300) [r, b] = [x, c];
  else [r, b] = [c, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

const hsvToHex = (h: number, s: number, v: number) => {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
};

// ─── picker ────────────────────────────────────────────────────────────────────
interface Props {
  value: string;
  onChange: (hex: string) => void;
  presets?: string[];
}

/**
 * Freeform colour picker: a saturation/value square, a hue strip, hex + RGB
 * entry, and optional quick-pick presets. Any colour the user can express.
 */
export function ColorPicker({ value, onChange, presets = [] }: Props) {
  const init = useMemo(() => {
    const rgb = hexToRgb(value) ?? { r: 0, g: 0, b: 0 };
    return rgbToHsv(rgb.r, rgb.g, rgb.b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [hsv, setHsv] = useState(init);
  const [hexText, setHexText] = useState(value);

  const hsvRef = useRef(hsv);
  hsvRef.current = hsv;
  const svDims = useRef({ w: 1, h: 1 });
  const hueW = useRef(1);

  // Sync when the value is changed from outside (e.g. a preset tapped upstream).
  useEffect(() => {
    const rgb = hexToRgb(value);
    if (!rgb) return;
    if (value.toLowerCase() === hsvToHex(hsvRef.current.h, hsvRef.current.s, hsvRef.current.v).toLowerCase()) return;
    setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
    setHexText(value);
  }, [value]);

  const emit = (next: { h: number; s: number; v: number }) => {
    setHsv(next);
    const hex = hsvToHex(next.h, next.s, next.v);
    setHexText(hex);
    onChange(hex);
  };

  const svPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { w, h } = svDims.current;
        emit({
          h: hsvRef.current.h,
          s: clamp(e.nativeEvent.locationX / w, 0, 1),
          v: 1 - clamp(e.nativeEvent.locationY / h, 0, 1),
        });
      },
      onPanResponderMove: (e) => {
        const { w, h } = svDims.current;
        emit({
          h: hsvRef.current.h,
          s: clamp(e.nativeEvent.locationX / w, 0, 1),
          v: 1 - clamp(e.nativeEvent.locationY / h, 0, 1),
        });
      },
    }),
  ).current;

  const huePan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) =>
        emit({ ...hsvRef.current, h: clamp(e.nativeEvent.locationX / hueW.current, 0, 1) * 360 }),
      onPanResponderMove: (e) =>
        emit({ ...hsvRef.current, h: clamp(e.nativeEvent.locationX / hueW.current, 0, 1) * 360 }),
    }),
  ).current;

  const [dims, setDims] = useState({ w: 0, h: 0, hue: 0 });
  const onSvLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    svDims.current = { w: width, h: height };
    setDims((d) => ({ ...d, w: width, h: height }));
  };
  const onHueLayout = (e: LayoutChangeEvent) => {
    hueW.current = e.nativeEvent.layout.width;
    setDims((d) => ({ ...d, hue: e.nativeEvent.layout.width }));
  };

  const commitHex = () => {
    const rgb = hexToRgb(hexText);
    if (rgb) emit(rgbToHsv(rgb.r, rgb.g, rgb.b));
    else setHexText(hsvToHex(hsv.h, hsv.s, hsv.v));
  };

  const setChannel = (ch: 'r' | 'g' | 'b', raw: string) => {
    const cur = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const n = clamp(parseInt(raw.replace(/[^0-9]/g, '') || '0', 10), 0, 255);
    const rgb = { r: Math.round(cur.r), g: Math.round(cur.g), b: Math.round(cur.b), [ch]: n };
    emit(rgbToHsv(rgb.r, rgb.g, rgb.b));
  };

  const hueHex = hsvToHex(hsv.h, 1, 1);
  const current = hsvToHex(hsv.h, hsv.s, hsv.v);
  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const R = Math.round(rgb.r);
  const G = Math.round(rgb.g);
  const B = Math.round(rgb.b);

  return (
    <View style={styles.wrap}>
      {/* Saturation / value */}
      <View style={styles.svBox} onLayout={onSvLayout} {...svPan.panHandlers}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: hueHex, borderRadius: 10 }]} />
        <LinearGradient
          colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 10 }]}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 10 }]}
        />
        {dims.w > 0 && (
          <View
            pointerEvents="none"
            style={[
              styles.svThumb,
              { left: hsv.s * dims.w - 9, top: (1 - hsv.v) * dims.h - 9 },
            ]}
          />
        )}
      </View>

      {/* Hue */}
      <View style={styles.hueBox} onLayout={onHueLayout} {...huePan.panHandlers}>
        <LinearGradient
          colors={['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 11 }]}
        />
        {dims.hue > 0 && (
          <View pointerEvents="none" style={[styles.hueThumb, { left: (hsv.h / 360) * dims.hue - 11 }]} />
        )}
      </View>

      {/* Preview + hex + rgb */}
      <View style={styles.inputsRow}>
        <View style={[styles.preview, { backgroundColor: current }]} />
        <View style={styles.hexWrap}>
          <Text style={styles.fieldLabel}>HEX</Text>
          <TextInput
            style={styles.hexInput}
            value={hexText}
            onChangeText={setHexText}
            onEndEditing={commitHex}
            onSubmitEditing={commitHex}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={7}
          />
        </View>
        {(['r', 'g', 'b'] as const).map((ch, i) => (
          <View key={ch} style={styles.rgbWrap}>
            <Text style={styles.fieldLabel}>{ch.toUpperCase()}</Text>
            <TextInput
              style={styles.rgbInput}
              value={String([R, G, B][i])}
              onChangeText={(t) => setChannel(ch, t)}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>
        ))}
      </View>

      {/* Quick presets */}
      {presets.length > 0 && (
        <View style={styles.presetRow}>
          {presets.map((p) => (
            <Pressable
              key={p}
              style={[
                styles.presetSwatch,
                { backgroundColor: p },
                p.toLowerCase() === current.toLowerCase() && styles.presetActive,
              ]}
              onPress={() => {
                const c = hexToRgb(p);
                if (c) emit(rgbToHsv(c.r, c.g, c.b));
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

/** The picker inside a tap-to-dismiss modal card, with a Done button. */
export function ColorPickerModal({
  visible,
  value,
  onChange,
  onClose,
  presets,
}: {
  visible: boolean;
  value: string;
  onChange: (hex: string) => void;
  onClose: () => void;
  presets?: string[];
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalScrim} onPress={onClose}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          <Text style={styles.modalTitle}>Colour</Text>
          <ColorPicker value={value} onChange={onChange} presets={presets} />
          <Pressable style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  svBox: { width: '100%', height: 150, borderRadius: 10, overflow: 'hidden' },
  svThumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  hueBox: { width: '100%', height: 22, borderRadius: 11 },
  hueThumb: {
    position: 'absolute',
    top: -1,
    width: 22,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  inputsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  preview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
  },
  fieldLabel: {
    fontFamily: theme.font.ui,
    fontSize: 9,
    letterSpacing: 1,
    color: theme.color.fg3,
    marginBottom: 3,
  },
  hexWrap: { flex: 1.4 },
  rgbWrap: { flex: 1 },
  hexInput: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    color: theme.color.fg1,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  rgbInput: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    color: theme.color.fg1,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 8,
    textAlign: 'center',
  },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  presetSwatch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
  },
  presetActive: { borderWidth: 3, borderColor: theme.palette.forest },
  modalScrim: {
    flex: 1,
    backgroundColor: 'rgba(43,38,33,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.color.bg1,
    borderRadius: theme.radius.lg,
    padding: 20,
    gap: 14,
  },
  modalTitle: {
    fontFamily: theme.font.display,
    fontSize: 22,
    color: theme.color.fg1,
  },
  doneBtn: {
    backgroundColor: theme.palette.forest,
    borderRadius: theme.radius.pill,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneText: { fontFamily: theme.font.ui, fontSize: 15, fontWeight: '600', color: theme.palette.cream },
});
