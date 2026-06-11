import React, { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { usePPFonts } from '../src/theme/fonts';
import { theme } from '../src/theme/theme';
import { initRevenueCat } from '../src/lib/revenuecat';
import { initAnalytics } from '../src/lib/analytics';
import { initNotifications } from '../src/lib/notifications';
import { useAppStore } from '../src/store/app';
import { fetchTodaysPack, sanityItemToShopItem } from '../src/services/content';

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

    const store = useAppStore.getState();
    store.checkAndSyncPremium();

    // Fetch today's daily pack and populate delivered items
    fetchTodaysPack().then(({ freeItems, subItems }) => {
      const { subscribed, setDeliveredItemIds, setShopItems, shopItems } = useAppStore.getState();
      const delivered = subscribed ? [...freeItems, ...subItems] : freeItems;
      const ids = delivered.map((si) => si._id.replace('item-', ''));
      setDeliveredItemIds(ids);
      // Also merge any new pack items into the shop catalogue so the editor can display them
      if (delivered.length > 0) {
        const existingIds = new Set(shopItems.map((s) => s.id));
        const newItems = delivered
          .filter((si) => !existingIds.has(si._id.replace('item-', '')))
          .map(sanityItemToShopItem);
        if (newItems.length > 0) setShopItems([...shopItems, ...newItems]);
      }
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
        <Stack.Screen name="package" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="subscription" />
        <Stack.Screen name="editor/[id]" />
        <Stack.Screen name="feedback" />
      </Stack>
    </>
  );
}
