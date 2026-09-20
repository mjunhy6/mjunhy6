import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CefrLevel } from '../data/types';

const LEVEL_COLORS: Record<CefrLevel, string> = {
  A1: '#22c55e',
  A2: '#84cc16',
  B1: '#eab308',
  B2: '#f97316',
  C1: '#ef4444',
  C2: '#a855f7',
};

export function LevelBadge({ level }: { level: CefrLevel }) {
  return (
    <View style={[styles.badge, { backgroundColor: LEVEL_COLORS[level] }]}>
      <Text style={styles.text}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 12,
  },
});
