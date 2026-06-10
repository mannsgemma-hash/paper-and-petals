import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { theme } from '../theme/theme'

export function AdBanner() {
  const router = useRouter()
  return (
    <Pressable style={styles.banner} onPress={() => router.push('/subscription')}>
      <Feather name="star" size={13} color={theme.palette.terracotta} />
      <Text style={styles.text}>Remove ads with The Cottage subscription</Text>
      <Feather name="arrow-right" size={13} color={theme.palette.terracotta} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(196,123,99,0.08)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(196,123,99,0.18)',
  },
  text: {
    fontFamily: theme.font.ui,
    fontSize: 12,
    letterSpacing: 0.4,
    color: theme.palette.terracotta,
    fontWeight: '600',
  },
})
