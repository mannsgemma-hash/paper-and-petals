import React from 'react';
import {
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
  const toggleSubscribed = useAppStore((s) => s.toggleSubscribed);

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
              title="Start subscription"
              pill
              onPress={toggleSubscribed}
              style={styles.startBtn}
            />
          )}
        </Card>

        {/* Cancel first */}
        {subscribed && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Cancel subscription</Text>
            <Text style={styles.cardBody}>
              Your deliveries will return to one per day. You’ll keep
              everything you’ve collected.
            </Text>
            <Button
              title="Cancel subscription"
              variant="danger"
              onPress={toggleSubscribed}
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
            <Button title="Switch to annual" onPress={() => {}} />
          </View>
        </Card>

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
  footer: {
    textAlign: 'center',
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.micro,
    letterSpacing: 1.2,
    color: theme.color.fg4,
    marginBottom: 32,
  },
});
