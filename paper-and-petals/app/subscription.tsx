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
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Eyebrow } from '../src/components/Eyebrow';
import { theme } from '../src/theme/theme';
import { useAppStore } from '../src/store/app';
import { purchasePackage, restorePurchases } from '../src/lib/revenuecat';
import { screen, track } from '../src/lib/analytics';

// SCR-24 Subscription Management. Cancel-first, no dark patterns.
// The benefit list leads with the ad-free studio; copy is calm and plain.

const SUB_BENEFITS = [
  'A calm, ad-free studio — no banners, ever',
  'Three deliveries each morning, instead of one',
  'Every seasonal pack included, the day it opens',
  'One exclusive heirloom item each month',
  'Everything you collect stays yours, forever',
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const subscribed = useAppStore((s) => s.subscribed);
  const setPremium = useAppStore((s) => s.setPremium);
  const toggleSubscribed = useAppStore((s) => s.toggleSubscribed);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    screen('Subscription');
  }, []);

  async function handleStartSubscription() {
    setLoading(true);
    try {
      const success = await purchasePackage('monthly');
      if (success) {
        setPremium(true);
        track('subscription_started', { plan: 'monthly' });
        Alert.alert('Welcome to The Cottage!', 'Your subscription is now active.', [{ text: 'Thanks!' }]);
      }
    } catch (e: any) {
      Alert.alert('Purchase failed', e?.message ?? 'Something went wrong. Please try again.', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSwitchToAnnual() {
    setLoading(true);
    try {
      const success = await purchasePackage('annual');
      if (success) {
        setPremium(true);
        track('subscription_started', { plan: 'annual' });
      }
    } catch (e: any) {
      Alert.alert('Purchase failed', e?.message ?? 'Something went wrong. Please try again.', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRestorePurchases() {
    setLoading(true);
    try {
      const success = await restorePurchases();
      if (success) {
        setPremium(true);
        Alert.alert('Purchases restored', 'Your subscription has been restored.', [{ text: 'Great!' }]);
      } else {
        Alert.alert('Nothing to restore', 'No active subscription was found for your account.', [{ text: 'OK' }]);
      }
    } catch {
      Alert.alert('Restore failed', 'Could not restore purchases. Please try again.', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen texture={false} style={styles.root}>
      {/* Top bar */}
      <View style={styles.topbar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={theme.color.fg1} />
        </Pressable>
        <Text style={styles.topTitle}>Manage your subscription</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Status card */}
        <Card stitched style={styles.statusCard}>
          <Eyebrow color={theme.palette.forest}>
            {subscribed ? 'You are in The Cottage' : 'Free tier'}
          </Eyebrow>
          <View style={styles.titleRow}>
            <Text style={styles.cottage}>The Cottage</Text>
            <Text style={styles.cottageSuffix}> · monthly</Text>
          </View>
          <Text style={styles.statusBody}>
            $4.99 AUD per month. Renews on{' '}
            <Text style={styles.bold}>4 July 2026</Text>. You can cancel any
            time — no scripts, no scare screens.
          </Text>
          <View style={styles.benefits}>
            {SUB_BENEFITS.map((line) => (
              <View key={line} style={styles.benefitRow}>
                <View style={styles.benefitCheck}>
                  <Feather name="check" size={14} color={theme.palette.cream} />
                </View>
                <Text style={styles.benefitText}>{line}</Text>
              </View>
            ))}
          </View>
          {!subscribed && (
            <Button
              title={loading ? 'Please wait…' : 'Start subscription'}
              pill
              onPress={handleStartSubscription}
              style={styles.startBtn}
              disabled={loading}
            />
          )}
        </Card>

        {/* Cancel first */}
        {subscribed && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Cancel subscription</Text>
            <Text style={styles.cardBody}>
              Your deliveries will return to one per day. You'll keep
              everything you've collected.
            </Text>
            <Button
              title="Cancel subscription"
              variant="danger"
              onPress={() =>
                Alert.alert(
                  'Cancel subscription',
                  'To cancel, open Settings → Apple ID → Subscriptions on your device.',
                  [{ text: 'OK' }],
                )
              }
              style={styles.cancelBtn}
            />
          </Card>
        )}

        {/* Switch plan */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Switch to annual</Text>
          <View style={styles.annualRow}>
            <Text style={[styles.cardBody, styles.annualCopy]}>
              $39.99 a year — save roughly two months. No price tricks at
              renewal.
            </Text>
            <Button
              title={loading ? 'Please wait…' : 'Switch to annual'}
              onPress={handleSwitchToAnnual}
              disabled={loading}
            />
          </View>
        </Card>

        {/* Restore purchases */}
        <Pressable
          style={styles.restoreLink}
          onPress={handleRestorePurchases}
          disabled={loading}
        >
          <Text style={styles.restoreText}>Restore purchases</Text>
        </Pressable>

        <Text style={styles.footer}>
          BILLED THROUGH THE APP STORE · CANCEL ANY TIME, NO SCARE SCREENS
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: theme.color.bg2 },
  topbar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    backgroundColor: theme.color.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.hairlineSoft,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.color.bg1,
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
  scroll: {
    padding: 24,
    paddingBottom: 40,
    gap: 18,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  statusCard: { padding: 28 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
    marginBottom: 6,
  },
  cottage: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: 30,
    color: theme.palette.terracotta,
  },
  cottageSuffix: {
    fontFamily: theme.font.display,
    fontSize: 26,
    color: theme.color.fg1,
  },
  statusBody: {
    fontFamily: theme.font.ui,
    fontSize: 15,
    lineHeight: 22,
    color: theme.color.fg2,
    marginBottom: 18,
  },
  bold: { fontWeight: '700' },
  benefits: { gap: 10 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  benefitCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.palette.sage,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  benefitText: {
    flex: 1,
    fontFamily: theme.font.ui,
    fontSize: 14,
    lineHeight: 20,
    color: theme.color.fg2,
  },
  startBtn: { marginTop: 20 },
  card: { padding: 22, borderRadius: theme.radius.lg },
  cardTitle: {
    fontFamily: theme.font.display,
    fontSize: 20,
    color: theme.color.fg1,
    marginBottom: 6,
  },
  cardBody: {
    fontFamily: theme.font.ui,
    fontSize: 14,
    lineHeight: 20,
    color: theme.color.fg2,
    marginBottom: 16,
  },
  cancelBtn: { alignSelf: 'flex-start' },
  annualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    flexWrap: 'wrap',
  },
  annualCopy: { flex: 1, minWidth: 200, marginBottom: 0 },
  restoreLink: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  restoreText: {
    fontFamily: theme.font.ui,
    fontSize: 13,
    color: theme.color.fg3,
    textDecorationLine: 'underline',
  },
  footer: {
    textAlign: 'center',
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.micro,
    letterSpacing: 1.2,
    color: theme.color.fg4,
    marginBottom: 32,
  },
});
