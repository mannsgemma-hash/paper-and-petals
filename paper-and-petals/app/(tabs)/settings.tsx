import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../src/components/Screen';
import { SettingsRow } from '../../src/components/SettingsRow';
import { StatusStamp } from '../../src/components/StatusStamp';
import { Toggle } from '../../src/components/Toggle';
import { theme } from '../../src/theme/theme';
import { useAppStore } from '../../src/store/app';

// SCR-23 Settings. Single-column scrollable page with grouped section cards:
// Account & sync · Membership · Preferences · Notifications · Privacy & data ·
// About. Calm, plain language; no dark patterns.

function SectionCard({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionEyebrow}>{eyebrow.toUpperCase()}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function ValuePill({ value }: { value: string }) {
  return (
    <View style={styles.valuePill}>
      <Text style={styles.valuePillText}>{value}</Text>
    </View>
  );
}

const Chevron = () => (
  <Feather name="chevron-right" size={18} color={theme.color.fg4} />
);

export default function SettingsScreen() {
  const router = useRouter();
  const subscribed = useAppStore((s) => s.subscribed);

  const [prefs, setPrefs] = useState({
    sound: true,
    haptics: true,
    autosave: true,
    notifyDelivery: true,
    notifyPacks: false,
    analytics: true,
  });
  const [account, setAccount] = useState({ signedIn: false, email: '' });
  const [legalDoc, setLegalDoc] = useState<'terms' | 'privacy' | null>(null);

  const setPref = (k: keyof typeof prefs) => (v: boolean) =>
    setPrefs((p) => ({ ...p, [k]: v }));

  return (
    <Screen>
      {/* Top bar */}
      <View style={styles.topbar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={theme.color.fg1} />
        </Pressable>
        <Text style={styles.topTitle}>Settings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Account & sync */}
        <SectionCard eyebrow="Account & sync">
          {account.signedIn ? (
            <>
              <SettingsRow
                icon="user"
                title={account.email}
                description="Signed in. Your journals back up and sync automatically across every device you use."
                trailing={<StatusStamp tone="sage">Synced</StatusStamp>}
              />
              <SettingsRow
                divider
                icon="refresh-cw"
                title="Automatic sync"
                description="Last synced just now. Changes save in the background — no manual saving needed."
                trailing={<ValuePill value="On" />}
              />
            </>
          ) : (
            <>
              <SettingsRow
                icon="user"
                title="Playing locally"
                description="Your journals live on this device. Create a free account to back them up and sync across devices."
                trailing={<StatusStamp tone="cream">Local only</StatusStamp>}
              />
              <SettingsRow
                divider
                icon="star"
                title="Create account & turn on sync"
                description="Back up your journals and pick up on any device — phone or tablet. Takes a moment."
                trailing={<Chevron />}
                onPress={() =>
                  setAccount({ signedIn: true, email: 'alice@papercraft.studio' })
                }
              />
            </>
          )}
        </SectionCard>

        {/* Membership */}
        <SectionCard eyebrow="Membership">
          <SettingsRow
            icon="award"
            title={subscribed ? 'Paper & Petals premium' : 'Paper & Petals free'}
            description={
              subscribed
                ? 'Renews monthly. Includes all seasonal packs and the premium daily delivery.'
                : 'Subscribe to unlock seasonal packs and the richer premium daily delivery.'
            }
            trailing={
              subscribed ? (
                <StatusStamp tone="gold">Premium</StatusStamp>
              ) : (
                <StatusStamp tone="cream">Free</StatusStamp>
              )
            }
          />
          <SettingsRow
            divider
            icon={subscribed ? 'settings' : 'star'}
            title={subscribed ? 'Manage subscription' : 'Start subscription'}
            description={
              subscribed
                ? 'Change plan, pause, or cancel at any time. You keep everything you’ve collected.'
                : 'A small monthly fee. Cancel any time — your items and journals are yours forever.'
            }
            trailing={<Chevron />}
            onPress={() => router.push('/subscription')}
          />
          <SettingsRow
            divider
            icon="refresh-cw"
            title="Restore purchases"
            description="Restore packs and subscriptions from your App Store account."
            trailing={<Chevron />}
            onPress={() => {}}
          />
        </SectionCard>

        {/* Preferences */}
        <SectionCard eyebrow="Preferences">
          <SettingsRow
            icon="volume-2"
            title="Sound effects"
            description="Soft paper rustles when you place an item."
            trailing={<Toggle on={prefs.sound} onChange={setPref('sound')} />}
          />
          <SettingsRow
            divider
            icon="smartphone"
            title="Haptic feedback"
            description="Gentle taps confirm presses on supported devices."
            trailing={<Toggle on={prefs.haptics} onChange={setPref('haptics')} />}
          />
          <SettingsRow
            divider
            icon="check"
            title="Autosave"
            description="Save journal spreads as you place items. We don’t recommend turning this off."
            trailing={<Toggle on={prefs.autosave} onChange={setPref('autosave')} />}
          />
        </SectionCard>

        {/* Notifications */}
        <SectionCard eyebrow="Notifications">
          <SettingsRow
            icon="bell"
            title="Daily delivery reminder"
            description="A soft nudge when your parcel of items is ready."
            trailing={
              <Toggle on={prefs.notifyDelivery} onChange={setPref('notifyDelivery')} />
            }
          />
          <SettingsRow
            divider
            icon="gift"
            title="New seasonal packs"
            description="Hear about new collections — about once a month."
            trailing={
              <Toggle on={prefs.notifyPacks} onChange={setPref('notifyPacks')} />
            }
          />
        </SectionCard>

        {/* Privacy & data */}
        <SectionCard eyebrow="Privacy & data">
          <SettingsRow
            icon="shield"
            title="Anonymous usage analytics"
            description="Helps us improve the app. Never includes your journal content."
            trailing={
              <Toggle on={prefs.analytics} onChange={setPref('analytics')} />
            }
          />
          {/* Export parked until post-launch */}
          <SettingsRow
            divider
            icon="file-text"
            title="Privacy policy"
            trailing={<Chevron />}
            onPress={() => setLegalDoc('privacy')}
          />
          <SettingsRow
            divider
            icon="file-text"
            title="Terms of service"
            trailing={<Chevron />}
            onPress={() => setLegalDoc('terms')}
          />
        </SectionCard>

        {/* About */}
        <SectionCard eyebrow="About">
          <SettingsRow
            icon="info"
            title="Version"
            trailing={<Text style={styles.version}>1.0.0 · JUNE 2026</Text>}
          />
          <SettingsRow
            divider
            icon="message-square"
            title="Share feedback"
            description="Ideas, bugs, or just to say hello"
            trailing={<Chevron />}
            onPress={() => router.push('/feedback')}
          />
          {account.signedIn && (
            <SettingsRow
              divider
              danger
              icon="log-out"
              title="Sign out"
              trailing={<Chevron />}
              onPress={() => setAccount({ signedIn: false, email: '' })}
            />
          )}
        </SectionCard>

        {/* Closing flourish */}
        <Text style={styles.flourish}>
          with care, from the Paper <Text style={styles.amp}>&</Text> Petals studio
        </Text>
      </ScrollView>

      {/* Legal modal */}
      <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />
    </Screen>
  );
}

const LEGAL_COPY: Record<'terms' | 'privacy', { title: string; body: string }> = {
  terms: {
    title: 'Terms of Service',
    body:
      'Welcome to Paper & Petals. By using the app you agree to craft kindly: your journals are yours, your collected items are yours forever, and subscriptions can be cancelled at any time with no penalty.\n\nThe full terms — covering accounts, purchases, content rights, and acceptable use — live in cozy-craft-journal/ProjectDocumentation/Terms_of_Service.md and will be wired in with the backend phase.',
  },
  privacy: {
    title: 'Privacy Policy',
    body:
      'We collect as little as possible. Your journal content never leaves your device unless you create an account and turn on sync. Anonymous analytics can be switched off at any time.\n\nThe full policy lives in cozy-craft-journal/ProjectDocumentation/Privacy_Policy.md and will be wired in with the backend phase.',
  },
};

function LegalModal({
  doc,
  onClose,
}: {
  doc: 'terms' | 'privacy' | null;
  onClose: () => void;
}) {
  const copy = doc ? LEGAL_COPY[doc] : null;
  return (
    <Modal visible={!!doc} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.legalCard} onPress={() => {}}>
          {copy && (
            <>
              <Text style={styles.legalEyebrow}>PAPER & PETALS</Text>
              <Text style={styles.legalTitle}>{copy.title}</Text>
              <ScrollView style={styles.legalScroll}>
                <Text style={styles.legalBody}>{copy.body}</Text>
              </ScrollView>
              <Pressable style={styles.doneBtn} onPress={onClose}>
                <Text style={styles.doneBtnText}>Done</Text>
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
  topTitle: {
    fontFamily: theme.font.display,
    fontSize: 22,
    color: theme.color.fg1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  section: { marginBottom: 28 },
  sectionEyebrow: {
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.micro,
    letterSpacing: 2.4,
    color: theme.color.fg3,
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  sectionCard: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    overflow: 'hidden',
    ...theme.shadow.paper,
  },
  valuePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.bg2,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
  },
  valuePillText: {
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.caption,
    fontWeight: '600',
    color: theme.color.fg2,
  },
  version: {
    fontFamily: theme.font.ui,
    fontSize: 12,
    letterSpacing: 1.6,
    color: theme.color.fg3,
  },
  flourish: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: theme.fontSize.body,
    color: theme.color.fg4,
  },
  amp: { color: theme.palette.terracotta },

  // Legal modal
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(43,42,40,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  legalCard: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.palette.hairline,
    padding: 28,
    maxWidth: 560,
    width: '100%',
    maxHeight: '80%',
    ...theme.shadow.lift,
  },
  legalEyebrow: {
    fontFamily: theme.font.ui,
    fontSize: 10,
    letterSpacing: 2.4,
    color: theme.color.fg3,
    fontWeight: '600',
  },
  legalTitle: {
    fontFamily: theme.font.display,
    fontSize: theme.fontSize.h3,
    color: theme.color.fg1,
    marginTop: 6,
    marginBottom: 12,
  },
  legalScroll: { flexGrow: 0 },
  legalBody: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    lineHeight: 22,
    color: theme.color.fg2,
  },
  doneBtn: {
    marginTop: 18,
    alignSelf: 'flex-end',
    height: 44,
    paddingHorizontal: 24,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    fontWeight: '600',
    color: theme.palette.cream,
  },
});
