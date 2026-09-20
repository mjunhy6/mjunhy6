import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ProgressBar } from '../components/ProgressBar';
import { LevelGroupSelector } from '../components/LevelGroupSelector';
import { OrderModeSelector } from '../components/OrderModeSelector';
import { LevelGroup, LEVEL_GROUP_LABELS } from '../data/types';
import {
  PlanStats,
  TOTAL_WORDS,
  DAILY_GOAL,
  todaysLearnedCount,
  ProgressState,
  OrderMode,
} from '../state/progress';

interface Props {
  stats: PlanStats;
  progress: ProgressState;
  onStart: () => void;
  onSelectLevelGroup: (group: LevelGroup) => void;
  onSelectOrderMode: (mode: OrderMode) => void;
  onShowWordList: () => void;
  groupAllDone: boolean;
}

export function HomeScreen({
  stats,
  progress,
  onStart,
  onSelectLevelGroup,
  onSelectOrderMode,
  onShowWordList,
  groupAllDone,
}: Props) {
  const todayCount = todaysLearnedCount(progress);
  const goalReached = todayCount >= DAILY_GOAL;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>İngilizce 1500</Text>
      <Text style={styles.subtitle}>En sık kullanılan 1500 kelimeyi 5 ayda öğren</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Toplam ilerleme</Text>
        <ProgressBar progress={stats.learnedCount / TOTAL_WORDS} />
        <Text style={styles.cardValue}>
          {stats.learnedCount} / {TOTAL_WORDS} kelime
        </Text>
      </View>

      <Pressable style={styles.listButton} onPress={onShowWordList}>
        <Text style={styles.listButtonText}>📋 Kelime Listesi</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Bugünkü hedef</Text>
        <ProgressBar progress={todayCount / DAILY_GOAL} color="#38bdf8" />
        <Text style={styles.cardValue}>
          {todayCount} / {DAILY_GOAL} kelime {goalReached ? '✅' : ''}
        </Text>
      </View>

      {stats.dueReviewCount > 0 && (
        <View style={[styles.card, styles.reviewCard]}>
          <Text style={styles.cardLabel}>🔁 Tekrar zamanı</Text>
          <Text style={styles.cardValue}>
            {stats.dueReviewCount} kelimeyi tekrar etme zamanı geldi
          </Text>
        </View>
      )}

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

      <Text style={styles.sectionLabel}>Seviye seç</Text>
      <LevelGroupSelector selected={progress.levelGroup} onSelect={onSelectLevelGroup} />
      <Text style={styles.groupProgress}>
        {LEVEL_GROUP_LABELS[progress.levelGroup]}: {stats.groupLearnedCount} / {stats.groupTotalCount}{' '}
        kelime öğrenildi
      </Text>

      <Text style={styles.sectionLabel}>Kelime sırası</Text>
      <OrderModeSelector selected={progress.orderMode} onSelect={onSelectOrderMode} />

      {groupAllDone && stats.dueReviewCount === 0 ? (
        <View style={[styles.card, styles.doneCard]}>
          <Text style={styles.congratsBig}>
            🎉 {LEVEL_GROUP_LABELS[progress.levelGroup]} grubundaki tüm kelimeleri tamamladın!
          </Text>
        </View>
      ) : (
        <Pressable style={styles.button} onPress={onStart}>
          <Text style={styles.buttonText}>
            {stats.dueReviewCount > 0
              ? `Tekrar Et (${stats.dueReviewCount})`
              : goalReached
              ? 'Tekrar Çalış'
              : 'Kelime Öğrenmeye Başla'}
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
  reviewCard: { borderWidth: 1, borderColor: '#4338ca', backgroundColor: '#1e1b4b' },
  doneCard: { marginTop: 8 },
  listButton: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  listButtonText: { color: '#e2e8f0', fontSize: 14, fontWeight: '700' },
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
  sectionLabel: { color: '#cbd5e1', fontSize: 13, marginBottom: 8, marginTop: 4, fontWeight: '600' },
  groupProgress: { color: '#94a3b8', fontSize: 12, marginTop: 8, marginBottom: 20 },
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
