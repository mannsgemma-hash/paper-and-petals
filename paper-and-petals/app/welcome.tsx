import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { theme } from '../src/theme/theme';
import { useAppStore } from '../src/store/app';
import { markWelcomeComplete } from '../src/lib/storage';

// SCR-02 First-launch Welcome. Brand seal hero + intro form + onboarding CTAs.
// Only Name is mandatory; the rest are optional.

const logoTerracotta = require('../assets/logos/logo_terracotta.png');

export default function WelcomeScreen() {
  const router = useRouter();
  const setLaunchState = useAppStore((s) => s.setLaunchState);
  const toggleSubscribed = useAppStore((s) => s.toggleSubscribed);
  const subscribed = useAppStore((s) => s.subscribed);

  const { width } = useWindowDimensions();
  const phone = width < theme.layout.phoneBreakpoint;

  const [form, setForm] = useState({ name: '', zip: '', email: '', dob: '' });
  const update = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));
  const canContinue = form.name.trim().length > 0;

  const finish = (withSubscription: boolean) => {
    if (withSubscription && !subscribed) toggleSubscribed();
    setLaunchState('returning');
    // Persist welcome completion (+ today's open) so the next launch routes
    // by date, then let new users experience their first daily delivery.
    markWelcomeComplete();
    router.replace('/package');
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            phone ? styles.scrollPhone : styles.scrollTablet,
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={logoTerracotta}
            style={[styles.logo, phone && styles.logoPhone]}
          />

          <View style={styles.titleRow}>
            <Text style={[styles.titleWord, phone && styles.titleWordPhone]}>
              Paper
            </Text>
            <Text style={[styles.titleAmp, phone && styles.titleAmpPhone]}>
              &
            </Text>
            <Text style={[styles.titleWord, phone && styles.titleWordPhone]}>
              Petals
            </Text>
          </View>

          <Text style={[styles.subtitle, phone && styles.subtitlePhone]}>
            Welcome! Let us get to know you a little better.
          </Text>

          {/* Form */}
          <View style={[styles.form, { width: phone ? '100%' : 420 }]}>
            <Field
              label="Name"
              required
              placeholder="What may we call you?"
              value={form.name}
              onChangeText={update('name')}
            />
            <View style={phone ? styles.colPhone : styles.rowSplit}>
              <Field
                label="Email"
                optional
                placeholder="you@somewhere.com"
                value={form.email}
                onChangeText={update('email')}
                keyboardType="email-address"
                style={styles.flex}
              />
              <Field
                label="Zip"
                optional
                placeholder="2000"
                value={form.zip}
                onChangeText={update('zip')}
                style={styles.flex}
              />
            </View>
            <Field
              label="Date of birth"
              optional
              placeholder="DD / MM / YYYY"
              value={form.dob}
              onChangeText={update('dob')}
            />
          </View>

          {/* Actions */}
          <View style={[styles.actions, { width: phone ? '100%' : 320 }]}>
            <Button
              title="Subscribe & continue"
              pill
              disabled={!canContinue}
              onPress={() => finish(true)}
              style={styles.fullWidth}
            />
            <Button
              title="Continue without subscribing"
              variant="ghost"
              disabled={!canContinue}
              onPress={() => finish(false)}
              style={styles.fullWidth}
              textStyle={styles.ghostText}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'email-address';
  style?: object;
}

function Field({
  label,
  required,
  optional,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  style,
}: FieldProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>
        {label.toUpperCase()}
        {required ? <Text style={styles.req}> *</Text> : null}
        {optional ? <Text style={styles.opt}> · optional</Text> : null}
      </Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.color.fg4}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { alignItems: 'center', flexGrow: 1 },
  scrollTablet: { justifyContent: 'center', padding: 40 },
  scrollPhone: { justifyContent: 'flex-start', paddingVertical: 36, paddingHorizontal: 20 },
  logo: { width: 140, height: 140, resizeMode: 'contain' },
  logoPhone: { width: 104, height: 104 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginTop: 12,
    marginBottom: 6,
  },
  titleWord: {
    fontFamily: theme.font.display,
    fontSize: 48,
    color: theme.color.fg1,
    letterSpacing: -0.2,
  },
  titleWordPhone: { fontSize: 38 },
  titleAmp: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: 52,
    color: theme.palette.terracotta,
  },
  titleAmpPhone: { fontSize: 42 },
  subtitle: {
    fontFamily: theme.font.script,
    fontStyle: 'italic',
    fontSize: 20,
    color: theme.color.fg2,
    textAlign: 'center',
    maxWidth: 480,
    marginBottom: 22,
  },
  subtitlePhone: { fontSize: 18 },
  form: { maxWidth: 420, gap: 10 },
  rowSplit: { flexDirection: 'row', gap: 10 },
  colPhone: { gap: 10 },
  field: { gap: 4 },
  label: {
    fontFamily: theme.font.ui,
    fontSize: 12,
    color: theme.color.fg3,
    letterSpacing: 1,
    fontWeight: '600',
  },
  req: { color: theme.palette.terracotta },
  opt: {
    color: theme.color.fg4,
    textTransform: 'none',
    letterSpacing: 0,
    fontWeight: '400',
  },
  input: {
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.body,
    color: theme.color.fg1,
    backgroundColor: theme.color.surface,
    borderWidth: theme.border.card,
    borderColor: theme.palette.hairline,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 11,
    minHeight: 46,
  },
  actions: {
    gap: 10,
    marginTop: 22,
    alignItems: 'stretch',
    maxWidth: 420,
  },
  fullWidth: { width: '100%' },
  ghostText: { fontSize: 14, color: theme.color.fg2 },
});
