import React, { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { usePPFonts } from '../src/theme/fonts';
import { theme } from '../src/theme/theme';
import { initRevenueCat, syncEntitlements } from '../src/lib/revenuecat';
import { initAnalytics } from '../src/lib/analytics';
import { initNotifications } from '../src/lib/notifications';
import { installGlobalErrorHandler } from '../src/lib/errorReporting';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { useAppStore } from '../src/store/app';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = usePPFonts();

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    // Install first so any error thrown by the inits below is still reported.
    installGlobalErrorHandler();
    initAnalytics();
    initRevenueCat();
    initNotifications();
    // Sync subscription + owned collections from RevenueCat into the store.
    syncEntitlements()
      .then(({ studio, ownedCollectionIds, legacyOwnedItemIds }) => {
        const store = useAppStore.getState();
        store.setHasStudio(studio);
        if (ownedCollectionIds.length) store.setOwnedCollectionIds(ownedCollectionIds);
        if (legacyOwnedItemIds.length) store.setLegacyOwnedItemIds(legacyOwnedItemIds);
      })
      .catch(() => {});
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.color.bg1 },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="editor/[id]" />
        <Stack.Screen name="studio" options={{ presentation: 'modal' }} />
        <Stack.Screen name="library" />
        <Stack.Screen name="feedback" />
      </Stack>
    </ErrorBoundary>
  );
}
