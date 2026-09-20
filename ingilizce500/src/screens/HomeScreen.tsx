import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ProgressBar } from '../components/ProgressBar';
import { PlanStats } from '../state/progress';
import { TOTAL_WORDS, DAILY_GOAL, todaysLearnedCount, ProgressState } from '../state/progress';

interface Props {
  stats: PlanStats;
  progress: ProgressState;
  onStart: () => void;
  allDone: boolean;
}

export function HomeScreen({ stats, progress, onStart, allDone }: Props) {
  const todayCount = todaysLearnedCount(progress);
  const goalReached = todayCount >= DAILY_GOAL;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İngilizce 500</Text>
      <Text style={styles.subtitle}>En sık kullanılan 500 kelimeyi 2 ayda öğren</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Toplam ilerleme</Text>
        <ProgressBar progress={stats.learnedCount / TOTAL_WORDS} />
        <Text style={styles.cardValue}>
          {stats.learnedCount} / {TOTAL_WORDS} kelime
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Bugünkü hedef</Text>
        <ProgressBar progress={todayCount / DAILY_GOAL} color="#38bdf8" />
        <Text style={styles.cardValue}>
          {todayCount} / {DAILY_GOAL} kelime {goalReached ? '✅' : ''}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{progress.streakDays}</Text>
          <Text style={styles.statLabel}>gün seri</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.remaining}</Text>
          <Text style={styles.statLabel}>kalan kelime</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.estimatedDaysLeftAtGoalPace}</Text>
          <Text style={styles.statLabel}>gün kaldı</Text>
        </View>
      </View>

      {!stats.onTrack && stats.daysElapsedSinceStart > 0 && (
        <Text style={styles.warning}>
          Hedefin biraz gerisindesin, bugün birkaç kelime daha çalışmaya ne dersin?
        </Text>
      )}

      {allDone ? (
        <View style={styles.card}>
          <Text style={styles.congratsBig}>🎉 Tebrikler! 500 kelimeyi tamamladın!</Text>
        </View>
      ) : (
        <Pressable style={styles.button} onPress={onStart}>
          <Text style={styles.buttonText}>
            {goalReached ? 'Tekrar Çalış' : 'Kelime Öğrenmeye Başla'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 24, paddingTop: 64 },
  title: { fontSize: 28, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 4, marginBottom: 24 },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardLabel: { color: '#cbd5e1', fontSize: 13, marginBottom: 8 },
  cardValue: { color: '#f8fafc', fontSize: 15, marginTop: 8, fontWeight: '600' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statBox: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: { color: '#f8fafc', fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#94a3b8', fontSize: 11, marginTop: 2, textAlign: 'center' },
  warning: { color: '#fbbf24', fontSize: 13, marginBottom: 16, textAlign: 'center' },
  congratsBig: { color: '#f8fafc', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  button: {
    backgroundColor: '#38bdf8',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#0f172a', fontSize: 16, fontWeight: '800' },
});
