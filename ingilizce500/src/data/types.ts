export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

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
  examples: [string, string, string];
}

export const CEFR_ORDER: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
