import AsyncStorage from '@react-native-async-storage/async-storage';
import { WordEntry } from '../data/types';

const STORAGE_KEY = 'ingilizce500:progress:v1';
export const DAILY_GOAL = 10;
export const TOTAL_WORDS = 500;
export const TARGET_DAYS = 60; // ~2 ay

export interface HistoryItem {
  date: string; // YYYY-MM-DD
  wordId: number;
  correct: boolean;
}

export interface ProgressState {
  learnedIds: number[];
  wrongIds: number[]; // answered wrong at least once, eligible for review
  history: HistoryItem[];
  streakDays: number;
  lastActiveDate: string | null;
  startDate: string | null;
}

const emptyState = (): ProgressState => ({
  learnedIds: [],
  wrongIds: [],
  history: [],
  streakDays: 0,
  lastActiveDate: null,
  startDate: null,
});

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function loadProgress(): Promise<ProgressState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as ProgressState;
    return { ...emptyState(), ...parsed };
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
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streakDays = state.lastActiveDate === yesterday ? state.streakDays + 1 : 1;
  return {
    ...state,
    streakDays,
    lastActiveDate: today,
    startDate: state.startDate ?? today,
  };
}

export function recordAnswer(
  state: ProgressState,
  wordId: number,
  correct: boolean
): ProgressState {
  const withStreak = bumpStreak(state);
  const history = [...withStreak.history, { date: todayKey(), wordId, correct }];

  let learnedIds = withStreak.learnedIds;
  let wrongIds = withStreak.wrongIds;

  if (correct) {
    if (!learnedIds.includes(wordId)) learnedIds = [...learnedIds, wordId];
    wrongIds = wrongIds.filter((id) => id !== wordId);
  } else if (!wrongIds.includes(wordId)) {
    wrongIds = [...wrongIds, wordId];
  }

  return { ...withStreak, history, learnedIds, wrongIds };
}

export function todaysLearnedCount(state: ProgressState): number {
  const today = todayKey();
  const learnedToday = new Set<number>();
  for (const h of state.history) {
    if (h.date === today && h.correct) learnedToday.add(h.wordId);
  }
  return learnedToday.size;
}

export function isDailyGoalReached(state: ProgressState): boolean {
  return todaysLearnedCount(state) >= DAILY_GOAL;
}

/**
 * Picks the next word to study: an unlearned word in easy-to-hard (id) order.
 * Falls back to a previously-missed word for review once every new word is learned.
 */
export function pickNextWord(words: WordEntry[], state: ProgressState): WordEntry | null {
  const sorted = [...words].sort((a, b) => a.id - b.id);
  const next = sorted.find((w) => !state.learnedIds.includes(w.id));
  if (next) return next;
  if (state.wrongIds.length > 0) {
    const reviewId = state.wrongIds[0];
    return words.find((w) => w.id === reviewId) ?? null;
  }
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
}

export function computeStats(state: ProgressState): PlanStats {
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
  };
}
