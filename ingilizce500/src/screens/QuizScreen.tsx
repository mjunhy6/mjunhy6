import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { WordEntry } from '../data/types';
import { LevelBadge } from '../components/LevelBadge';
import { buildOptions } from '../state/progress';

interface Props {
  word: WordEntry;
  mode: 'new' | 'review';
  allWords: WordEntry[];
  onAnswer: (correct: boolean) => void;
}

export function QuizScreen({ word, mode, allWords, onAnswer }: Props) {
  const options = useMemo(() => buildOptions(word, allWords), [word.id]);
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    const correct = option === word.turkish;
    setTimeout(() => onAnswer(correct), 450);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <LevelBadge level={word.level} />
        {mode === 'review' && (
          <View style={styles.reviewTag}>
            <Text style={styles.reviewTagText}>🔁 Tekrar</Text>
          </View>
        )}
      </View>
      <Text style={styles.pos}>{word.pos}</Text>
      <Text style={styles.word}>{word.word}</Text>
      <Text style={styles.prompt}>Bu kelimenin Türkçe karşılığı nedir?</Text>

      <View style={styles.options}>
        {options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrectOpt = opt === word.turkish;
          const showState = selected !== null;
          return (
            <Pressable
              key={opt}
              style={[
                styles.option,
                showState && isCorrectOpt && styles.optionCorrect,
                showState && isSelected && !isCorrectOpt && styles.optionWrong,
              ]}
              onPress={() => handleSelect(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 24, paddingTop: 64 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewTag: {
    backgroundColor: '#312e81',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  reviewTagText: { color: '#c7d2fe', fontSize: 12, fontWeight: '700' },
  pos: { color: '#94a3b8', fontSize: 13, marginTop: 12, textTransform: 'uppercase' },
  word: { color: '#f8fafc', fontSize: 40, fontWeight: '800', marginTop: 4 },
  prompt: { color: '#cbd5e1', fontSize: 15, marginTop: 24, marginBottom: 16 },
  options: { gap: 12 },
  option: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCorrect: { borderColor: '#22c55e', backgroundColor: '#14532d' },
  optionWrong: { borderColor: '#ef4444', backgroundColor: '#450a0a' },
  optionText: { color: '#f8fafc', fontSize: 17, fontWeight: '600' },
});
