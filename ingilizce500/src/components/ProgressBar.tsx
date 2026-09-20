import React from 'react';
import { View, StyleSheet } from 'react-native';

export function ProgressBar({ progress, color = '#22c55e' }: { progress: number; color?: string }) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#1e293b',
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
});
