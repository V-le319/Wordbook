// src/lib/useWords.ts
"use client";

import { useEffect, useState } from "react";
import { getWordInfo } from "./getWordInfo";

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

const STORAGE_KEY = "wordbook-words";

const startWords: Word[] = [
  {
    id: "1",
    text: "ineffable",
    meaning: "too great or deep to be put into words",
    partOfSpeech: "adjective",
    example: "She felt an ineffable sadness as the train pulled away.",
    exampleTranslation: "She felt a sadness too deep to describe.",
    note: "Used for feelings, beauty, or experiences that language falls short of. Pronounced in-EF-uh-bul.",
    learned: false,
  },
];

export function useWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setWords(saved ? JSON.parse(saved) : startWords);
    } catch {
      setWords(startWords);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  }, [words, loaded]);

    const addWord = async (text: string) => {
    const id = crypto.randomUUID();
    const newWord: Word = {
      id,
      text,
      meaning: "Looking up…",
      partOfSpeech: "",
      example: "",
      exampleTranslation: "",
      note: "",
      learned: false,
    };
    setWords((prev) => [newWord, ...prev]);

    const info = await getWordInfo(text);

    if (!info) {
      setWords((prev) => prev.filter((w) => w.id !== id));
      return;
    }

    setWords((prev) => prev.map((w) => (w.id === id ? { ...w, ...info } : w)));
  };

  const removeWord = (id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  return { words, addWord, removeWord };
}