export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LevelGroup = 'A' | 'B' | 'C';

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'determiner'
  | 'interjection'
  | 'number';

export interface WordEntry {
  id: number;
  word: string;
  pos: PartOfSpeech;
  level: CefrLevel;
  turkish: string;
  /** Kelimenin birincil anlamdan farklı, dikkate değer diğer Türkçe anlamları (varsa). */
  meanings: string[];
  examples: [string, string, string];
}

export const CEFR_ORDER: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const LEVEL_GROUPS: Record<LevelGroup, CefrLevel[]> = {
  A: ['A1', 'A2'],
  B: ['B1', 'B2'],
  C: ['C1', 'C2'],
};

export const LEVEL_GROUP_LABELS: Record<LevelGroup, string> = {
  A: 'A (Başlangıç)',
  B: 'B (Orta)',
  C: 'C (İleri)',
};

export function levelGroupOf(level: CefrLevel): LevelGroup {
  if (level === 'A1' || level === 'A2') return 'A';
  if (level === 'B1' || level === 'B2') return 'B';
  return 'C';
}
