import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { theme } from '../src/theme/theme';
import Constants from 'expo-constants';
import { track } from '../src/lib/analytics';

// SCR-Feedback. Collects an idea, bug report, or love note and hands it to the
// person's own email app, addressed to support. Email rather than a database:
// it lands in an inbox that is read anyway, a reply is one tap, and the app
// holds no write credentials. Full screen (not modal) so the back gesture works
// naturally.

const SUPPORT_EMAIL = 'admin@paperandpetals.app';

type FeedbackType = 'idea' | 'bug' | 'love';

const TYPES: { id: FeedbackType; label: string; icon: React.ComponentProps<typeof Feather>['name'] }[] = [
  { id: 'idea', label: 'An idea', icon: 'zap' },
  { id: 'bug',  label: 'A bug',   icon: 'alert-circle' },
  { id: 'love', label: 'Kind words', icon: 'heart' },
];

export default function FeedbackScreen() {
  const router = useRouter();

  const [type, setType] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const canSend = !!type && message.trim().length >= 10 && !sending;

  async function handleSend() {
    if (!canSend || !type) return;
    const label = TYPES.find((t) => t.id === type)?.label ?? 'Feedback';
    const version = Constants.expoConfig?.version ?? '';
    const subject = `Paper & Petals feedback: ${label}`;
    const body =
      `${message.trim()}\n\n` +
      `—\nApp ${version} · ${Platform.OS} ${String(Platform.Version)}`;
    const url =
      `mailto:${SUPPORT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSending(true);
    try {
      await Linking.openURL(url);
      track('feedback_opened_email', { type });
      setSent(true);
    } catch {
      // No email app set up. Keep their message on screen so nothing is lost.
      Alert.alert(
        'No email app found',
        `Please email us at ${SUPPORT_EMAIL} — your message is still here to copy.`,
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <Screen>
        <View style={styles.topbar}>
          <View style={styles.topbarSpacer} />
          <Text style={styles.topTitle}>Share feedback</Text>
          <View style={styles.topbarSpacer} />
        </View>
        <View style={styles.successWrap}>
          <View style={styles.successCircle}>
            <Feather name="check" size={30} color={theme.palette.forest} />
          </View>
          <Text style={styles.successTitle}>Thank you — just tap Send in your email.</Text>
          <Text style={styles.successBody}>
            Your message is waiting in your email app. Once it's sent, it comes straight to
            us, and we can write back.
          </Text>
          <Button
            title="Back to the studio"
            pill
            onPress={() => router.back()}
            style={styles.successBtn}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.topbar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={theme.color.fg1} />
        </Pressable>
        <Text style={styles.topTitle}>Share feedback</Text>
        <View style={styles.topbarSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.question}>How are you feeling about the studio?</Text>

          {/* Type selector */}
          <View style={styles.typeRow}>
            {TYPES.map((t) => {
              const active = type === t.id;
              return (
                <Pressable
                  key={t.id}
                  style={[styles.typeTile, active && styles.typeTileActive]}
                  onPress={() => setType(t.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                >
                  <Feather
                    name={t.icon}
                    size={22}
                    color={active ? theme.palette.forest : theme.color.fg2}
                  />
                  <Text style={[styles.tileLabel, active && styles.tileLabelActive]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Message */}
          <Text style={styles.fieldLabel}>Tell us more…</Text>
          <TextInput
            style={styles.textArea}
            value={message}
            onChangeText={setMessage}
            placeholder="Tell us what's on your mind…"
            placeholderTextColor={theme.color.fg4}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Send */}
          <Button
            title={sending ? 'Opening email…' : 'Continue in email'}
            pill
            disabled={!canSend}
            onPress={handleSend}
            style={styles.sendBtn}
          />

          <Text style={styles.disclaimer}>
            Opens your email app with this message addressed to {SUPPORT_EMAIL}. We read
            every message.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  topbar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.hairlineSoft,
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
  topTitle: {
    fontFamily: theme.font.display,
    fontSize: 20,
    color: theme.color.fg1,
  },
  topbarSpacer: { width: 44 },

  scroll: {
    padding: 24,
    paddingBottom: 40,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },

  question: {
    fontFamily: theme.font.display,
    fontSize: 24,
    color: theme.color.fg1,
    marginBottom: 22,
    letterSpacing: -0.2,
  },

  typeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  typeTile: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: theme.color.surface,
    borderWidth: 1.5,
    borderColor: theme.palette.hairline,
  },
  typeTileActive: {
    backgroundColor: 'rgba(78,102,82,0.08)',
    borderColor: theme.palette.forest,
  },
  tileLabel: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    fontWeight: '600',
    color: theme.color.fg2,
    textAlign: 'center',
  },
  tileLabelActive: {
    color: theme.palette.forest,
  },

  fieldLabel: {
    fontFamily: theme.font.ui,
    fontSize: 12,
    fontWeight: '600',
    color: theme.color.fg2,
    letterSpacing: 0.4,
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  textArea: {
    fontFamily: theme.font.ui,
    fontSize: 15,
    color: theme.color.fg1,
    backgroundColor: theme.color.surface,
    borderWidth: 1.5,
    borderColor: theme.palette.hairline,
    borderRadius: theme.radius.sm,
    padding: 14,
    minHeight: 110,
    marginBottom: 18,
  },


  sendBtn: {
    width: '100%',
  },

  disclaimer: {
    marginTop: 16,
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: theme.fontSize.body,
    color: theme.color.fg3,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Success state
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(78,102,82,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  successTitle: {
    fontFamily: theme.font.display,
    fontSize: 24,
    color: theme.color.fg1,
    textAlign: 'center',
    letterSpacing: -0.2,
    marginBottom: 10,
  },
  successBody: {
    fontFamily: theme.font.ui,
    fontSize: 15,
    lineHeight: 22,
    color: theme.color.fg3,
    textAlign: 'center',
    maxWidth: 340,
    marginBottom: 28,
  },
  successBtn: {},
});
