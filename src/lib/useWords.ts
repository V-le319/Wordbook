
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabaseClient } from "./supabase/client";
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

type WordRow = {
  id: string;
  text: string;
  meaning: string;
  part_of_speech: string | null;
  example: string | null;
  example_translation: string | null;
  note: string | null;
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

function mapRowToWord(row: WordRow): Word {
  return {
    id: row.id,
    text: row.text,
    meaning: row.meaning,
    partOfSpeech: row.part_of_speech ?? "",
    example: row.example ?? "",
    exampleTranslation: row.example_translation ?? "",
    note: row.note ?? "",
    learned: row.learned ?? false,
  };
}

function mapWordToRow(word: Word) {
  return {
    text: word.text,
    meaning: word.meaning,
    part_of_speech: word.partOfSpeech || null,
    example: word.example || null,
    example_translation: word.exampleTranslation || null,
    note: word.note || null,
    learned: word.learned,
  };
}

export function useWords() {
  const supabase = useSupabaseClient();
  const { isLoaded, user } = useUser();

  const [words, setWords] = useState<Word[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load local words first, so the app works even without Supabase.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setWords(saved ? JSON.parse(saved) : startWords);
    } catch {
      setWords(startWords);
    }
    setLoaded(true);
  }, []);

  // Always keep a local copy.
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    } catch (error) {
      console.error("Failed to save words locally:", error);
    }
  }, [words, loaded]);

  // Sync with Supabase when signed in.
  useEffect(() => {
    if (!isLoaded || !user || !loaded) return;

    let cancelled = false;

    async function syncWords() {
      try {
        const { data, error } = await supabase
          .from("words")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (cancelled || !data) return;

        const remoteWords = (data as WordRow[]).map(mapRowToWord);
        const remoteIds = new Set(remoteWords.map((word) => word.id));

        // Keep local words that aren't already represented remotely.
        const localOnlyWords = words.filter(
          (word) => !remoteIds.has(word.id)
        );

        // Upload local-only words, then show the combined list.
        for (const word of localOnlyWords) {
          const { data: inserted, error: insertError } = await supabase
            .from("words")
            .insert(mapWordToRow(word))
            .select()
            .single();

          if (!insertError && inserted) {
            const savedWord = mapRowToWord(inserted as WordRow);
            const index = localOnlyWords.findIndex(
              (item) => item.id === word.id
            );
            if (index !== -1) localOnlyWords[index] = savedWord;
          } else if (insertError) {
            console.error("Failed to sync a local word:", insertError.message);
          }
        }

        if (!cancelled) {
          setWords([...localOnlyWords, ...remoteWords]);
        }
      } catch (error) {
        console.error("Supabase sync failed; keeping local words:", error);
      }
    }

    syncWords();

    return () => {
      cancelled = true;
    };
  // Run when authentication or initial local loading is ready.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id, loaded]);

  const addWord = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const tempId = crypto.randomUUID();

    const placeholder: Word = {
      id: tempId,
      text: cleanText,
      meaning: "Looking up…",
      partOfSpeech: "",
      example: "",
      exampleTranslation: "",
      note: "",
      learned: false,
    };

    setWords((prev) => [placeholder, ...prev]);

    try {
      const info = await getWordInfo(cleanText);

      if (!info) {
        setWords((prev) => prev.filter((word) => word.id !== tempId));
        return;
      }

      const newWord: Word = {
        ...placeholder,
        ...info,
      };

      // Save locally first. Supabase is an additional copy.
      setWords((prev) =>
        prev.map((word) => (word.id === tempId ? newWord : word))
      );

      if (user) {
        const { data, error } = await supabase
          .from("words")
          .insert(mapWordToRow(newWord))
          .select()
          .single();

        if (!error && data) {
          const savedWord = mapRowToWord(data as WordRow);

          setWords((prev) =>
            prev.map((word) =>
              word.id === tempId ? savedWord : word
            )
          );
        } else if (error) {
          console.error("Supabase save failed; word remains local:", error.message);
        }
      }
    } catch (error) {
      console.error("Failed to look up word:", error);
      setWords((prev) => prev.filter((word) => word.id !== tempId));
    }
  };

  const removeWord = async (id: string) => {
    // Remove locally immediately.
    setWords((prev) => prev.filter((word) => word.id !== id));

    if (user && id !== "1") {
      const { error } = await supabase
        .from("words")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Supabase delete failed:", error.message);
      }
    }
  };

  return { words, addWord, removeWord, loaded };
}
