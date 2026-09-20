import React, { useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';

interface Props {
  text: string;
  size?: 'small' | 'large';
}

/** Metni Amerikan İngilizcesi aksanıyla sesli okutan buton. */
export function SpeakerButton({ text, size = 'small' }: Props) {
  const [speaking, setSpeaking] = useState(false);

  function handlePress() {
    Speech.stop();
    setSpeaking(true);
    Speech.speak(text, {
      language: 'en-US',
      rate: 0.95,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  }

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.button, size === 'large' && styles.large, speaking && styles.active]}
      hitSlop={8}
    >
      <Text style={[styles.icon, size === 'large' && styles.iconLarge]}>🔊</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  active: {
    backgroundColor: '#0369a1',
  },
  icon: {
    fontSize: 14,
  },
  iconLarge: {
    fontSize: 20,
  },
});
