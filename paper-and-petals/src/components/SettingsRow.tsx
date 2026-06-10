import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { theme } from '../theme/theme';

type FeatherName = ComponentProps<typeof Feather>['name'];

interface SettingsRowProps {
  icon: FeatherName;
  title: string;
  description?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
  divider?: boolean;
  danger?: boolean;
}

export function SettingsRow({
  icon,
  title,
  description,
  trailing,
  onPress,
  divider,
  danger,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        divider && styles.divider,
        pressed && onPress ? styles.pressed : null,
      ]}
    >
      <View style={[styles.iconBox, danger && styles.iconBoxDanger]}>
        <Feather
          name={icon}
          size={18}
          color={danger ? theme.palette.terracotta : theme.palette.forest}
        />
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, danger && styles.titleDanger]}>{title}</Text>
        {description ? <Text style={styles.desc}>{description}</Text> : null}
      </View>
      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space[4],
    minHeight: 64,
    paddingHorizontal: theme.space[5],
    paddingVertical: theme.space[3],
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: theme.palette.hairline,
  },
  pressed: { backgroundColor: 'rgba(75,64,56,0.03)' },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(78,102,82,0.10)',
  },
  iconBoxDanger: { backgroundColor: 'rgba(196,123,99,0.10)' },
  body: { flex: 1, minWidth: 0 },
  title: {
    fontFamily: theme.font.ui,
    fontSize: 15,
    fontWeight: '600',
    color: theme.color.fg1,
  },
  titleDanger: { color: theme.palette.terracotta },
  desc: {
    fontFamily: theme.font.ui,
    fontSize: theme.fontSize.caption,
    color: theme.color.fg3,
    marginTop: 2,
    lineHeight: 17,
  },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
