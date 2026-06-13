import React, { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { usePPFonts } from '../src/theme/fonts';
import { theme } from '../src/theme/theme';
import { initRevenueCat, syncEntitlements } from '../src/lib/revenuecat';
import { initAnalytics } from '../src/lib/analytics';
import { initNotifications } from '../src/lib/notifications';
import { useAppStore } from '../src/store/app';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = usePPFonts();

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    initRevenueCat();
    initAnalytics();
    initNotifications();
    // Sync subscription + owned packs from RevenueCat into the store.
    syncEntitlements().then(({ studio, ownedPackIds }) => {
      useAppStore.getState().setHasStudio(studio);
      if (ownedPackIds.length) useAppStore.getState().setOwnedItemIds(ownedPackIds);
    });
  }, []);

  if (!fontsLoaded) return null;

  return (
    <>
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
        <Stack.Screen name="feedback" />
      </Stack>
    </>
  );
}
