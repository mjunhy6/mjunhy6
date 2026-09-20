import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import words from './src/data/words.json';
import { WordEntry } from './src/data/types';
import {
  ProgressState,
  loadProgress,
  saveProgress,
  recordAnswer,
  pickNextWord,
  computeStats,
} from './src/state/progress';
import { HomeScreen } from './src/screens/HomeScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { FeedbackScreen } from './src/screens/FeedbackScreen';

const WORDS = words as WordEntry[];

type View_ = 'loading' | 'home' | 'quiz' | 'feedback';

export default function App() {
  const [view, setView] = useState<View_>('loading');
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [currentWord, setCurrentWord] = useState<WordEntry | null>(null);
  const [wasCorrect, setWasCorrect] = useState(false);

  useEffect(() => {
    loadProgress().then((p) => {
      setProgress(p);
      setView('home');
    });
  }, []);

  if (view === 'loading' || !progress) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#38bdf8" size="large" />
      </View>
    );
  }

  function startQuiz() {
    const next = pickNextWord(WORDS, progress!);
    if (!next) {
      setView('home');
      return;
    }
    setCurrentWord(next);
    setView('quiz');
  }

  async function handleAnswer(correct: boolean) {
    const updated = recordAnswer(progress!, currentWord!.id, correct);
    setProgress(updated);
    await saveProgress(updated);
    setWasCorrect(correct);
    setView('feedback');
  }

  function handleNext() {
    const next = pickNextWord(WORDS, progress!);
    if (!next) {
      setView('home');
      return;
    }
    setCurrentWord(next);
    setView('quiz');
  }

  const stats = computeStats(progress);
  const allDone = stats.learnedCount >= WORDS.length;

  return (
    <>
      <StatusBar style="light" />
      {view === 'home' && (
        <HomeScreen stats={stats} progress={progress} onStart={startQuiz} allDone={allDone} />
      )}
      {view === 'quiz' && currentWord && (
        <QuizScreen word={currentWord} allWords={WORDS} onAnswer={handleAnswer} />
      )}
      {view === 'feedback' && currentWord && (
        <FeedbackScreen
          word={currentWord}
          wasCorrect={wasCorrect}
          onNext={handleNext}
          onStop={() => setView('home')}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' },
});
