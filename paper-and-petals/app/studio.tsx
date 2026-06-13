import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { theme } from '../src/theme/theme';
import { useAppStore } from '../src/store/app';
import { STUDIO_PRICING } from '../src/data/shop';
import {
  purchaseStudio,
  restorePurchases,
  type StudioPlan,
} from '../src/lib/revenuecat';
import { screen, track } from '../src/lib/analytics';

// Studio subscription screen. Presented as a modal. Annual is pre-selected as
// the best value; a 7-day trial and "cancel anytime" remove the pressure, and
// the keepsake-pack alternative is always one tap away in the shop.

const BENEFITS: { icon: any; title: string; body: string }[] = [
  {
    icon: 'package',
    title: 'The whole living library',
    body: 'Every paper, sticker, washi, floral and frame — unlocked.',
  },
  {
    icon: 'gift',
    title: 'New treasures every week',
    body: 'Fresh items arrive constantly, all included in your plan.',
  },
  {
    icon: 'heart',
    title: 'Yours to keep, always',
    body: 'Anything you place in a journal stays in it forever — even if you pause.',
  },
];

export default function StudioScreen() {
  const router = useRouter();
  const hasStudio = useAppStore((s) => s.hasStudio);
  const setHasStudio = useAppStore((s) => s.setHasStudio);
  const setOwnedItemIds = useAppStore((s) => s.setOwnedItemIds);
  const [plan, setPlan] = useState<StudioPlan>('annual');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    screen('Studio');
  }, []);

  const subscribe = async () => {
    setBusy(true);
    try {
      const ok = await purchaseStudio(plan);
      if (ok) {
        setHasStudio(true);
        track('studio_subscribed', { plan });
        Alert.alert(
          'Welcome to Studio',
          'The whole library is yours. Open a journal and start crafting.',
          [{ text: 'Lovely', onPress: () => router.back() }],
        );
      }
    } catch (e: any) {
      Alert.alert('Couldn’t start Studio', e?.message ?? 'Please try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    setBusy(true);
    try {
      const { studio, ownedPackIds } = await restorePurchases();
      setHasStudio(studio);
      if (ownedPackIds.length) setOwnedItemIds(ownedPackIds);
      Alert.alert(
        studio || ownedPackIds.length ? 'Purchases restored' : 'Nothing to restore',
        studio
          ? 'Your Studio subscription is active again.'
          : ownedPackIds.length
            ? 'Your keepsake packs are back in your collection.'
            : 'We couldn’t find any past purchases for this account.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={styles.topbar}>
        <View style={styles.iconBtn} />
        <Text style={styles.eyebrow}>PAPER & PETALS</Text>
        <Pressable style={styles.iconBtn} onPress={() => router.back()} hitSlop={8}>
          <Feather name="x" size={20} color={theme.color.fg2} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>
          Studio
        </Text>
        <Text style={styles.subtitle}>
          Unlock the entire, ever-growing collection of crafting treasures.
        </Text>

        {hasStudio ? (
          <View style={styles.activeCard}>
            <Feather name="check-circle" size={22} color={theme.palette.forest} />
            <Text style={styles.activeText}>
              Your Studio subscription is active. Enjoy the whole library.
            </Text>
          </View>
        ) : null}

        {/* Benefits */}
        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <View key={b.title} style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Feather name={b.icon} size={18} color={theme.palette.forest} />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitBody}>{b.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {!hasStudio && (
          <>
            {/* Plans */}
            <PlanCard
              selected={plan === 'annual'}
              onPress={() => setPlan('annual')}
              title="Annual"
              price={STUDIO_PRICING.annual.price}
              period={`per year · ${STUDIO_PRICING.annual.perMonth}/mo`}
              badge={`Save ${STUDIO_PRICING.annual.saving}`}
            />
            <PlanCard
              selected={plan === 'monthly'}
              onPress={() => setPlan('monthly')}
              title="Monthly"
              price={STUDIO_PRICING.monthly.price}
              period="per month"
            />

            <Text style={styles.trial}>7 days free, then your plan. Cancel anytime.</Text>

            <Pressable
              style={[styles.cta, busy && { opacity: 0.6 }]}
              onPress={subscribe}
              disabled={busy}
            >
              <Text style={styles.ctaText}>
                {busy ? 'Just a moment…' : 'Start 7-day free trial'}
              </Text>
            </Pressable>

            <Pressable onPress={restore} disabled={busy} style={styles.restoreBtn}>
              <Text style={styles.restoreText}>Restore purchases</Text>
            </Pressable>

            {/* Keepsake alternative */}
            <View style={styles.alt}>
              <Text style={styles.altText}>
                Prefer to buy once? Individual keepsake packs are yours forever.
              </Text>
              <Pressable onPress={() => router.replace('/(tabs)/shop')}>
                <Text style={styles.altLink}>Browse the shop →</Text>
              </Pressable>
            </View>
          </>
        )}

        <Text style={styles.fine}>
          Subscriptions renew automatically unless cancelled at least 24 hours before the end
          of the period. Manage or cancel anytime in your App Store account settings.
        </Text>
      </ScrollView>
    </Screen>
  );
}

function PlanCard({
  selected,
  onPress,
  title,
  price,
  period,
  badge,
}: {
  selected: boolean;
  onPress: () => void;
  title: string;
  price: string;
  period: string;
  badge?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.plan, selected && styles.planSelected]}
    >
      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected && <Feather name="check" size={13} color={theme.palette.cream} />}
      </View>
      <View style={styles.planMain}>
        <View style={styles.planTitleRow}>
          <Text style={styles.planTitle}>{title}</Text>
          {badge && (
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.planPeriod}>{period}</Text>
      </View>
      <Text style={styles.planPrice}>{price}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topbar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  eyebrow: {
    fontFamily: theme.font.ui,
    fontSize: 11,
    letterSpacing: 2.4,
    color: theme.color.fg3,
    fontWeight: '700',
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontFamily: theme.font.flourish,
    fontSize: 52,
    color: theme.palette.forest,
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: 17,
    color: theme.color.fg2,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 24,
  },
  activeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(78,102,82,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(78,102,82,0.35)',
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 20,
  },
  activeText: {
    flex: 1,
    fontFamily: theme.font.ui,
    fontSize: 14,
    color: theme.color.fg1,
    lineHeight: 20,
  },
  benefits: { gap: 16, marginBottom: 28 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(78,102,82,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: { flex: 1 },
  benefitTitle: {
    fontFamily: theme.font.ui,
    fontSize: 16,
    fontWeight: '700',
    color: theme.color.fg1,
  },
  benefitBody: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    color: theme.color.fg2,
    lineHeight: 20,
    marginTop: 2,
  },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.color.surface,
    borderWidth: 1.5,
    borderColor: theme.palette.hairline,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 12,
  },
  planSelected: {
    borderColor: theme.palette.forest,
    backgroundColor: 'rgba(78,102,82,0.06)',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.palette.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: theme.palette.forest,
    borderColor: theme.palette.forest,
  },
  planMain: { flex: 1 },
  planTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planTitle: {
    fontFamily: theme.font.display,
    fontSize: 20,
    color: theme.color.fg1,
  },
  planBadge: {
    backgroundColor: theme.palette.terracotta,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.pill,
  },
  planBadgeText: {
    fontFamily: theme.font.ui,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.palette.cream,
  },
  planPeriod: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    color: theme.color.fg3,
    marginTop: 2,
  },
  planPrice: {
    fontFamily: theme.font.display,
    fontSize: 22,
    color: theme.color.fg1,
  },
  trial: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    color: theme.color.fg3,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  cta: {
    height: 56,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.palette.forest,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
  ctaText: {
    fontFamily: theme.font.ui,
    fontSize: 17,
    fontWeight: '700',
    color: theme.palette.cream,
  },
  restoreBtn: { alignSelf: 'center', paddingVertical: 14 },
  restoreText: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    color: theme.palette.forest,
    fontWeight: '600',
  },
  alt: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 16,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: theme.palette.hairlineSoft,
  },
  altText: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    color: theme.color.fg3,
    textAlign: 'center',
  },
  altLink: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    fontWeight: '700',
    color: theme.palette.terracotta,
  },
  fine: {
    fontFamily: theme.font.ui,
    fontSize: 11,
    lineHeight: 16,
    color: theme.color.fg4,
    textAlign: 'center',
    marginTop: 18,
  },
});
