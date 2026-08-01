import React, { useState } from 'react';
import {
  Alert,
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
import { restorePurchases } from '../../src/lib/revenuecat';
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
  const hasStudio = useAppStore((s) => s.hasStudio);
  const setHasStudio = useAppStore((s) => s.setHasStudio);
  const setOwnedCollectionIds = useAppStore((s) => s.setOwnedCollectionIds);
  const setLegacyOwnedItemIds = useAppStore((s) => s.setLegacyOwnedItemIds);

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

        {/* Studio & collection */}
        <SectionCard eyebrow="Studio & collection">
          {hasStudio ? (
            <SettingsRow
              icon="package"
              title="Studio is active"
              description="The whole living library is unlocked. Manage or cancel in your App Store account."
              trailing={<StatusStamp tone="sage">Active</StatusStamp>}
            />
          ) : (
            <SettingsRow
              icon="package"
              title="Unlock everything with Studio"
              description="The full catalogue plus new items every week. 7 days free, cancel anytime."
              trailing={<Chevron />}
              onPress={() => router.push('/studio')}
            />
          )}
          <SettingsRow
            divider
            icon="heart"
            title="Collections you buy are yours forever"
            description="Anything you buy once — or place in a journal — stays with you, subscription or not."
            trailing={<StatusStamp tone="cream">Yours</StatusStamp>}
          />
          <SettingsRow
            divider
            icon="refresh-cw"
            title="Restore purchases"
            description="Restore your subscription and bought collections from your App Store account — handy on a new device."
            trailing={<Chevron />}
            onPress={async () => {
              const { studio, ownedCollectionIds, legacyOwnedItemIds } = await restorePurchases();
              setHasStudio(studio);
              if (ownedCollectionIds.length) setOwnedCollectionIds(ownedCollectionIds);
              if (legacyOwnedItemIds.length) setLegacyOwnedItemIds(legacyOwnedItemIds);
              const restored = studio || ownedCollectionIds.length > 0 || legacyOwnedItemIds.length > 0;
              Alert.alert(
                restored ? 'Purchases restored' : 'Nothing to restore',
                restored
                  ? 'Your subscription and collections are back in your library.'
                  : 'We couldn’t find any past purchases for this account.',
              );
            }}
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
            icon="gift"
            title="New items in the shop"
            description="A soft nudge when fresh papers, stickers, and treasures arrive."
            trailing={
              <Toggle on={prefs.notifyDelivery} onChange={setPref('notifyDelivery')} />
            }
          />
          <SettingsRow
            divider
            icon="bell"
            title="New seasonal collections"
            description="Hear about larger themed collections — about once a month."
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
    body: `Last updated 1 August 2026

Welcome to Paper & Petals. By downloading or using the app you agree to these terms. Please read them.

YOUR LICENCE
We grant you a personal, non-transferable licence to use Paper & Petals to create your own journals. The app and its artwork, fonts and design are owned by us or our licensors and are protected by copyright.

YOUR CONTENT
Your journals and anything you import are yours — you keep all rights to them. You are responsible for the content you add, and you confirm you have the right to use any images you import.

BUYING COLLECTIONS AND STUDIO
• Collections you buy outright are yours to keep and use inside the app forever, including after a Studio subscription ends.
• Studio is an auto-renewing subscription. Payment is charged to your Apple ID at confirmation of purchase, and it renews automatically unless cancelled at least 24 hours before the end of the current period. Manage or cancel it in your Apple ID settings — we cannot cancel it for you.
• Prices are shown before purchase and may change for future purchases.
• Purchases are processed by Apple; refunds are subject to Apple's policies.

ARTWORK AND PRINTING
Artwork you unlock may be used in your personal journals and printed for your own use. You may not redistribute, resell, or use the raw artwork as your own product.

ACCEPTABLE USE
Please do not misuse the app: do not attempt to break, copy, resell or reverse-engineer it, or use it to store or share unlawful content.

AVAILABILITY AND CHANGES
We work hard to keep the app running but cannot promise it will always be available or error-free. We may add, change or remove features over time.

DISCLAIMER AND LIABILITY
The app is provided "as is". To the extent permitted by law, we exclude implied warranties and are not liable for indirect or incidental losses, or for loss of content you have not backed up. Nothing in these terms limits rights you have under law that cannot be excluded.

CHANGES TO THESE TERMS
We may update these terms; we will change the date above and, for material changes, let you know in the app. Continuing to use the app means you accept the updated terms.

CONTACT
Questions: support@paperandpetals.app`,
  },
  privacy: {
    title: 'Privacy Policy',
    body: `Last updated 1 August 2026

Paper & Petals makes a digital scrapbooking app. This policy explains what we collect, why, and the choices you have. We collect as little as possible.

WHAT WE COLLECT
• Your journals and uploads. The pages you make and the photos you import are stored on your device. If cloud sync is enabled for your account, a secure copy is stored so you can restore it — otherwise it never leaves your device.
• Your name and email, only if you provide them. We use these to save your place and, if you opt in, to send occasional updates about new collections. You can unsubscribe at any time.
• Purchase information. When you buy a collection or subscribe to Studio, Apple processes the payment. We receive a record of what you own (via RevenueCat) so we can unlock it — we never see your card details.
• Anonymous usage analytics. We record which screens and features are used, and app errors, to fix bugs and improve the app. This never includes your journal content, and you can turn analytics off in Settings.
• Push notifications. If you allow them, a device token is stored (via OneSignal) so we can send reminders and news. You can turn these off in your device settings.

WHO WE SHARE WITH
We do not sell your data. We use a small number of providers who process data on our behalf: Apple (payments), RevenueCat (purchase records), PostHog (analytics), OneSignal (notifications) and Supabase (optional cloud sync and mailing list). Each receives only what it needs.

HOW LONG WE KEEP IT
We keep your account data for as long as you use the app. You can ask us to delete your email and any synced content at any time.

YOUR CHOICES
• Turn analytics off in Settings.
• Turn notifications off in your device settings.
• Unsubscribe from emails via any email we send.
• Request access to, or deletion of, your data by emailing us.

CHILDREN
Paper & Petals is not directed at children under 13, and we do not knowingly collect their data.

CHANGES
We may update this policy; we will change the date above and, for material changes, let you know in the app.

CONTACT
Questions or requests: support@paperandpetals.app`,
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
