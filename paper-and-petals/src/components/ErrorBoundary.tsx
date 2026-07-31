import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';
import { captureException } from '../lib/analytics';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render/lifecycle exceptions anywhere below it so a single thrown error
 * degrades to a recoverable screen instead of hard-crashing the whole app (which
 * is what a release build does with an uncaught JS error). Also reports the error
 * — with its stack — so we can see the real cause of production crashes.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    captureException(error, { componentStack: info.componentStack, boundary: 'root' });
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <View style={styles.wrap}>
        <Text style={styles.title}>A little snag</Text>
        <Text style={styles.body}>
          Something went sideways while opening that. Your saved work is safe — let’s try again.
        </Text>
        <Pressable style={styles.button} onPress={this.reset}>
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
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
});
