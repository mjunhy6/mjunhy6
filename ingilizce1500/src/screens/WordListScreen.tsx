import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { WordEntry, LevelGroup, LEVEL_GROUP_LABELS, LEVEL_GROUPS } from '../data/types';
import { LevelBadge } from '../components/LevelBadge';

type FilterMode = 'all' | LevelGroup;

const FILTERS: { mode: FilterMode; label: string }[] = [
  { mode: 'all', label: 'Tümü' },
  { mode: 'A', label: LEVEL_GROUP_LABELS.A },
  { mode: 'B', label: LEVEL_GROUP_LABELS.B },
  { mode: 'C', label: LEVEL_GROUP_LABELS.C },
];

interface Props {
  words: WordEntry[];
  learnedIds: number[];
  onBack: () => void;
}

export function WordListScreen({ words, learnedIds, onBack }: Props) {
  const [filter, setFilter] = useState<FilterMode>('all');
  const learnedSet = useMemo(() => new Set(learnedIds), [learnedIds]);

  const filteredWords = useMemo(() => {
    const sorted = [...words].sort((a, b) => a.id - b.id);
    if (filter === 'all') return sorted;
    const levels = LEVEL_GROUPS[filter];
    return sorted.filter((w) => levels.includes(w.level));
  }, [words, filter]);

  const learnedInFilter = filteredWords.filter((w) => learnedSet.has(w.id)).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton} hitSlop={8}>
          <Text style={styles.backText}>← Geri</Text>
        </Pressable>
        <Text style={styles.title}>Kelime Listesi</Text>
      </View>

      <Text style={styles.countText}>
        {learnedInFilter} / {filteredWords.length} kelime öğrenildi
      </Text>

      <View style={styles.filterRow}>
        {FILTERS.map(({ mode, label }) => {
          const active = mode === filter;
          return (
            <Pressable
              key={mode}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setFilter(mode)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filteredWords}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const learned = learnedSet.has(item.id);
          return (
            <View style={[styles.row, learned && styles.rowLearned]}>
              <LevelBadge level={item.level} />
              <View style={styles.rowTextBlock}>
                <Text style={[styles.word, learned && styles.wordLearned]}>{item.word}</Text>
                <Text style={[styles.turkish, learned && styles.turkishLearned]}>{item.turkish}</Text>
              </View>
              {learned && <Text style={styles.check}>✓</Text>}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', paddingTop: 64 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, gap: 16 },
  backButton: { paddingVertical: 4 },
  backText: { color: '#38bdf8', fontSize: 15, fontWeight: '700' },
  title: { color: '#f8fafc', fontSize: 20, fontWeight: '800' },
  countText: { color: '#94a3b8', fontSize: 13, paddingHorizontal: 24, marginTop: 12 },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 24, marginTop: 12, marginBottom: 8 },
  filterChip: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterChipActive: { backgroundColor: '#0c4a6e', borderColor: '#38bdf8' },
  filterText: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  filterTextActive: { color: '#e0f2fe' },
  listContent: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  rowLearned: {
    backgroundColor: '#14532d',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  rowTextBlock: { flex: 1 },
  word: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  wordLearned: { color: '#dcfce7' },
  turkish: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
  turkishLearned: { color: '#bbf7d0' },
  check: { color: '#4ade80', fontSize: 18, fontWeight: '800' },
});
