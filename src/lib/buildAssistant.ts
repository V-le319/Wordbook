import type { Word } from "./useWords";

export type VoiceChoice = "female" | "male";
export type ToneChoice = "casual" | "formal";

const VOICES: Record<VoiceChoice, string> = {
  female: "sarah",
  male: "burt",
};

const TONES: Record<ToneChoice, string> = {
  casual: "Talk like a friendly, relaxed friend. Warm, light and a little playful.",
  formal: "Talk like a patient, polite teacher. Calm, clear and precise.",
};

export function buildAssistant(word: Word, voice: VoiceChoice, tone: ToneChoice) {
  return {
    name: "Wordbook Tutor",
    firstMessage: `Hi! Let's practice the word ${word.text}. It means ${word.meaning}. Can you try using it in a sentence?`,
    transcriber: { provider: "deepgram", model: "nova-3", language: "en" },
    voice: { provider: "11labs", voiceId: VOICES[voice] },
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a vocabulary tutor speaking out loud with a learner. Today's word is "${word.text}", meaning: ${word.meaning}. Example: ${word.example}. ${TONES[tone]} Use short sentences and everyday English. One idea at a time. Keep every reply under 30 words. Gently correct mistakes, then ask them to try another sentence. Stay on this word.`,
        },
      ],
    },
  };
}