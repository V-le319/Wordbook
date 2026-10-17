// src/lib/use-words.ts
export type Word = {
  id: string;
  text: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  exampleTranslation: string;
  note: string;
  learned: boolean;
};

export function useWords() {
  // TODO: words state, addWord, removeWord, toggleLearned
  return {};
}