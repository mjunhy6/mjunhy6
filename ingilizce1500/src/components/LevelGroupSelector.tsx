import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LevelGroup, LEVEL_GROUP_LABELS } from '../data/types';

const GROUPS: LevelGroup[] = ['A', 'B', 'C'];

interface Props {
  selected: LevelGroup;
  onSelect: (group: LevelGroup) => void;
}

export function LevelGroupSelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {GROUPS.map((group) => {
        const active = group === selected;
        return (
          <Pressable
            key={group}
            style={[styles.button, active && styles.buttonActive]}
            onPress={() => onSelect(group)}
          >
            <Text style={[styles.text, active && styles.textActive]}>{LEVEL_GROUP_LABELS[group]}</Text>
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
  buttonActive: { backgroundColor: '#0c4a6e', borderColor: '#38bdf8' },
  text: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
  textActive: { color: '#e0f2fe' },
});
