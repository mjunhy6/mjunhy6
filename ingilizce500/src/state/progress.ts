import AsyncStorage from '@react-native-async-storage/async-storage';
import { WordEntry } from '../data/types';

const STORAGE_KEY = 'ingilizce500:progress:v2';
export const DAILY_GOAL = 10;
export const TOTAL_WORDS = 500;
export const TARGET_DAYS = 60; // ~2 ay

/** Leitner-box tarzı aralıklı tekrar: box arttıkça tekrar aralığı büyür (gün). */
export const SRS_INTERVALS_DAYS = [1, 3, 7, 14, 30];
export const MAX_SRS_BOX = SRS_INTERVALS_DAYS.length - 1;

export interface HistoryItem {
  date: string; // YYYY-MM-DD
  wordId: number;
  correct: boolean;
  mode: 'new' | 'review';
}

export interface SrsEntry {
  box: number; // 0..MAX_SRS_BOX
  nextReviewDate: string; // YYYY-MM-DD
  reviewCount: number;
}

export interface ProgressState {
  learnedIds: number[];
  wrongIds: number[]; // answered wrong at least once (bilgi amaçlı, istatistik için)
  srs: Record<number, SrsEntry>;
  history: HistoryItem[];
  streakDays: number;
  lastActiveDate: string | null;
  startDate: string | null;
}

const emptyState = (): ProgressState => ({
  learnedIds: [],
  wrongIds: [],
  srs: {},
  history: [],
  streakDays: 0,
  lastActiveDate: null,
  startDate: null,
});

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateKey: string, days: number): string {
  const d = new Date(dateKey + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function loadProgress(): Promise<ProgressState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...emptyState(), ...parsed, srs: parsed.srs ?? {} };
  } catch {
    return emptyState();
  }
}

export async function saveProgress(state: ProgressState): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bumpStreak(state: ProgressState): ProgressState {
  const today = todayKey();
  if (state.lastActiveDate === today) return state;
  const yesterday = addDays(today, -1);
  const streakDays = state.lastActiveDate === yesterday ? state.streakDays + 1 : 1;
  return {
    ...state,
    streakDays,
    lastActiveDate: today,
    startDate: state.startDate ?? today,
  };
}

/**
 * Bir kelime cevaplandığında ilerlemeyi günceller.
 * - Yeni kelime (henüz öğrenilmemiş) doğru cevaplanırsa: öğrenildi olarak işaretlenir
 *   ve SRS kutusu 0'dan başlatılır (yarın tekrar edilecek şekilde planlanır).
 * - Zaten öğrenilmiş bir kelime (tekrar) doğru cevaplanırsa: SRS kutusu bir artar ve
 *   bir sonraki tekrar tarihi uzar. Yanlış cevaplanırsa kutu sıfırlanır, yarın tekrar edilir.
 */
export function recordAnswer(
  state: ProgressState,
  wordId: number,
  correct: boolean,
  mode: 'new' | 'review'
): ProgressState {
  const withStreak = bumpStreak(state);
  const today = todayKey();
  const history = [...withStreak.history, { date: today, wordId, correct, mode }];

  let learnedIds = withStreak.learnedIds;
  let wrongIds = withStreak.wrongIds;
  let srs = withStreak.srs;

  if (mode === 'new') {
    if (correct) {
      if (!learnedIds.includes(wordId)) learnedIds = [...learnedIds, wordId];
      wrongIds = wrongIds.filter((id) => id !== wordId);
      srs = {
        ...srs,
        [wordId]: { box: 0, nextReviewDate: addDays(today, SRS_INTERVALS_DAYS[0]), reviewCount: 0 },
      };
    } else if (!wrongIds.includes(wordId)) {
      wrongIds = [...wrongIds, wordId];
    }
  } else {
    // review
    const current = srs[wordId] ?? { box: 0, nextReviewDate: today, reviewCount: 0 };
    if (correct) {
      const box = Math.min(current.box + 1, MAX_SRS_BOX);
      srs = {
        ...srs,
        [wordId]: {
          box,
          nextReviewDate: addDays(today, SRS_INTERVALS_DAYS[box]),
          reviewCount: current.reviewCount + 1,
        },
      };
      wrongIds = wrongIds.filter((id) => id !== wordId);
    } else {
      srs = {
        ...srs,
        [wordId]: {
          box: 0,
          nextReviewDate: addDays(today, SRS_INTERVALS_DAYS[0]),
          reviewCount: current.reviewCount,
        },
      };
      if (!wrongIds.includes(wordId)) wrongIds = [...wrongIds, wordId];
    }
  }

  return { ...withStreak, history, learnedIds, wrongIds, srs };
}

export function todaysLearnedCount(state: ProgressState): number {
  const today = todayKey();
  const learnedToday = new Set<number>();
  for (const h of state.history) {
    if (h.date === today && h.correct && h.mode === 'new') learnedToday.add(h.wordId);
  }
  return learnedToday.size;
}

export function isDailyGoalReached(state: ProgressState): boolean {
  return todaysLearnedCount(state) >= DAILY_GOAL;
}

export function getDueReviewIds(state: ProgressState): number[] {
  const today = todayKey();
  return Object.entries(state.srs)
    .filter(([, entry]) => entry.nextReviewDate <= today)
    .sort((a, b) => a[1].nextReviewDate.localeCompare(b[1].nextReviewDate))
    .map(([id]) => Number(id));
}

export interface QueueItem {
  word: WordEntry;
  mode: 'new' | 'review';
}

/**
 * Sıradaki kelimeyi seçer: önce bugün tekrar zamanı gelmiş (SRS) kelimeler,
 * ardından kolaydan zora sırayla henüz öğrenilmemiş yeni kelimeler.
 */
export function pickNextWord(words: WordEntry[], state: ProgressState): QueueItem | null {
  const dueIds = getDueReviewIds(state);
  if (dueIds.length > 0) {
    const word = words.find((w) => w.id === dueIds[0]);
    if (word) return { word, mode: 'review' };
  }

  const sorted = [...words].sort((a, b) => a.id - b.id);
  const next = sorted.find((w) => !state.learnedIds.includes(w.id));
  if (next) return { word: next, mode: 'new' };

  return null;
}

/** 4 seçenek: doğru Türkçe karşılık + 3 farklı yanlış seçenek (karıştırılmış). */
export function buildOptions(word: WordEntry, allWords: WordEntry[]): string[] {
  const distractorPool = allWords.filter(
    (w) => w.id !== word.id && w.turkish.toLowerCase() !== word.turkish.toLowerCase()
  );
  const shuffled = [...distractorPool].sort(() => Math.random() - 0.5);
  const distractors = shuffled.slice(0, 3).map((w) => w.turkish);
  const options = [word.turkish, ...distractors];
  return options.sort(() => Math.random() - 0.5);
}

export interface PlanStats {
  learnedCount: number;
  remaining: number;
  daysActive: number;
  daysElapsedSinceStart: number;
  onTrack: boolean;
  estimatedDaysLeftAtGoalPace: number;
  dueReviewCount: number;
}

export function computeStats(words: WordEntry[], state: ProgressState): PlanStats {
  const learnedCount = state.learnedIds.length;
  const remaining = TOTAL_WORDS - learnedCount;
  const activeDates = new Set(state.history.map((h) => h.date));
  const daysActive = activeDates.size;
  const daysElapsedSinceStart = state.startDate
    ? Math.max(1, Math.floor((Date.now() - new Date(state.startDate).getTime()) / 86400000) + 1)
    : 0;
  const expectedByNow = Math.min(TOTAL_WORDS, daysElapsedSinceStart * DAILY_GOAL);
  return {
    learnedCount,
    remaining,
    daysActive,
    daysElapsedSinceStart,
    onTrack: learnedCount >= expectedByNow || daysElapsedSinceStart === 0,
    estimatedDaysLeftAtGoalPace: Math.ceil(remaining / DAILY_GOAL),
    dueReviewCount: getDueReviewIds(state).length,
  };
}
