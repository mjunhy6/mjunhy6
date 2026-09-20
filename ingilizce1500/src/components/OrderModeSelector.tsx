import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { OrderMode } from '../state/progress';

const OPTIONS: { mode: OrderMode; label: string }[] = [
  { mode: 'sequential', label: 'Kolaydan Zora' },
  { mode: 'random', label: 'Rastgele' },
];

interface Props {
  selected: OrderMode;
  onSelect: (mode: OrderMode) => void;
}

export function OrderModeSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map(({ mode, label }) => {
        const active = mode === selected;
        return (
          <Pressable
            key={mode}
            style={[styles.button, active && styles.buttonActive]}
            onPress={() => onSelect(mode)}
          >
            <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  button: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  buttonActive: { backgroundColor: '#3730a3', borderColor: '#818cf8' },
  text: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
  textActive: { color: '#e0e7ff' },
});
