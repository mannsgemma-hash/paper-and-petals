import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';
import { captureException } from '../lib/analytics';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  stack: string | null;
  showDetail: boolean;
}

/**
 * Catches render/lifecycle exceptions anywhere below it so a single thrown error
 * degrades to a recoverable screen instead of hard-crashing the whole app (which
 * is what a release build does with an uncaught JS error). Also reports the error
 * — with its stack — so we can see the real cause of production crashes.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, stack: null, showDetail: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    captureException(error, { componentStack: info.componentStack, boundary: 'root' });
    // Keep the stack on screen too. Analytics only helps if it's configured and
    // the device reached the network; a tester reading the message back is the
    // one reporting channel that always works.
    this.setState({ stack: info.componentStack ?? null });
    console.error('[ErrorBoundary]', error?.message, error?.stack, info.componentStack);
  }

  reset = () => this.setState({ error: null, stack: null, showDetail: false });

  render() {
    const { error, stack, showDetail } = this.state;
    if (!error) return this.props.children;
    const detail = [
      error.message || String(error),
      error.stack ?? '',
      stack ? `\nComponent stack:${stack}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    return (
      <View style={styles.wrap}>
        <Text style={styles.title}>A little snag</Text>
        <Text style={styles.body}>
          Something went sideways while opening that. Your saved work is safe — let’s try again.
        </Text>
        <Pressable style={styles.button} onPress={this.reset}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>

        {/* The whole point of a beta: the message that says WHY. Tucked behind a
            tap so it never greets an ordinary reader, selectable so it can be
            copied straight into a bug report. */}
        <Pressable onPress={() => this.setState({ showDetail: !showDetail })} hitSlop={8}>
          <Text style={styles.detailToggle}>{showDetail ? 'Hide details' : 'Show details'}</Text>
        </Pressable>
        {showDetail && (
          <ScrollView style={styles.detailBox} contentContainerStyle={styles.detailInner}>
            <Text style={styles.detailText} selectable>
              {detail}
            </Text>
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
    backgroundColor: theme.color.bg1,
  },
  title: {
    fontFamily: theme.font.display,
    fontSize: 28,
    color: theme.color.fg1,
    textAlign: 'center',
  },
  body: {
    fontFamily: theme.font.ui,
    fontSize: 15,
    lineHeight: 22,
    color: theme.color.fg2,
    textAlign: 'center',
    maxWidth: 340,
  },
  button: {
    marginTop: 8,
    backgroundColor: theme.palette.terracotta,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: theme.radius.pill,
  },
  buttonText: {
    fontFamily: theme.font.ui,
    fontSize: 15,
    fontWeight: '600',
    color: theme.palette.cream,
  },
  detailToggle: {
    marginTop: 18,
    fontFamily: theme.font.ui,
    fontSize: 13,
    color: theme.color.fg3,
    textDecorationLine: 'underline',
  },
  detailBox: {
    maxHeight: 260,
    alignSelf: 'stretch',
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.palette.hairlineSoft,
    backgroundColor: theme.palette.cream,
  },
  detailInner: {
    padding: 12,
  },
  detailText: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontSize: 11,
    lineHeight: 16,
    color: theme.color.fg2,
  },
});
