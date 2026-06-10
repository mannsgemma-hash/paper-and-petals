import React from 'react';
import { Stack } from 'expo-router';
import { theme } from '../../src/theme/theme';

// The design has no visible tab bar — Home reaches Shop and Settings through
// its own top-right buttons, and both return with a back arrow. A Stack keeps
// that navigation model while preserving the (tabs) route group from the
// build plan.
export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.color.bg1 },
        animation: 'fade',
      }}
    />
  );
}
