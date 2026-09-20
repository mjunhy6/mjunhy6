import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { WordEntry } from '../data/types';
import { SpeakerButton } from '../components/SpeakerButton';

interface Props {
  word: WordEntry;
  mode: 'new' | 'review';
  wasCorrect: boolean;
  onNext: () => void;
  onStop: () => void;
}

export function FeedbackScreen({ word, mode, wasCorrect, onNext, onStop }: Props) {
  const headline = wasCorrect
    ? mode === 'review'
      ? '🎉 Tebrikler, hâlâ hatırlıyorsun!'
      : '🎉 Tebrikler, doğru!'
    : '📌 Doğrusu buydu';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headline}>{headline}</Text>
      {wasCorrect && mode === 'review' && (
        <Text style={styles.reviewNote}>Bu kelime bir süre sonra tekrar karşına çıkacak.</Text>
      )}
      <View style={styles.wordLine}>
        <Text style={styles.wordText}>
          {word.word} <Text style={styles.turkish}>— {word.turkish}</Text>
        </Text>
        <SpeakerButton text={word.word} />
      </View>

      {word.meanings.length > 0 && (
        <View style={styles.meaningsBox}>
          <Text style={styles.meaningsTitle}>Diğer anlamları</Text>
          {word.meanings.map((m, i) => (
            <Text key={i} style={styles.meaningItem}>
              • {m}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.examplesTitle}>Örnek cümleler</Text>
      {word.examples.map((ex, i) => (
        <View key={i} style={styles.exampleCard}>
          <Text style={styles.exampleText}>{ex}</Text>
          <SpeakerButton text={ex} />
        </View>
      ))}

      <Text style={styles.question}>Bir sonraki kelimeye geçelim mi?</Text>
      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.secondary]} onPress={onStop}>
          <Text style={styles.secondaryText}>Ana Sayfaya Dön</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Sonraki Kelime</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0f172a', padding: 24, paddingTop: 64 },
  headline: { color: '#f8fafc', fontSize: 24, fontWeight: '800' },
  reviewNote: { color: '#a5b4fc', fontSize: 13, marginTop: 6 },
  wordLine: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  wordText: { color: '#f8fafc', fontSize: 22, fontWeight: '700', flexShrink: 1 },
  turkish: { color: '#94a3b8', fontWeight: '500' },
  meaningsBox: {
    backgroundColor: '#422006',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  meaningsTitle: { color: '#fdba74', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  meaningItem: { color: '#fed7aa', fontSize: 14, lineHeight: 20 },
  examplesTitle: { color: '#cbd5e1', fontSize: 14, marginTop: 24, marginBottom: 8 },
  exampleCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  exampleText: { color: '#e2e8f0', fontSize: 15, lineHeight: 22, flex: 1 },
  question: { color: '#f8fafc', fontSize: 16, marginTop: 24, marginBottom: 12, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', gap: 12 },
  button: {
    backgroundColor: '#38bdf8',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
  },
  secondary: { backgroundColor: '#1e293b' },
  buttonText: { color: '#0f172a', fontSize: 15, fontWeight: '800' },
  secondaryText: { color: '#f8fafc', fontSize: 15, fontWeight: '700' },
});
