"use server";
import { auth } from "@clerk/nextjs/server";

const MODEL = "gemini-3.5-flash-lite";

export type ChatMsg = { from: "ai" | "me"; text: string };

export async function chatWithWord(
  word: { text: string; meaning: string; example: string },
  history: ChatMsg[]
): Promise<string> {
  const fail = "Something went wrong. Please try again.";
  try {
    const { userId } = await auth();
    if (!userId) return "Please sign in to use the AI assistant."

    const firstUser = history.findIndex((m) => m.from === "me");
    if (firstUser === -1) return fail;
    const turns = history.slice(firstUser);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `You are a friendly vocabulary tutor inside a flashcard app. The learner is studying the word "${word.text}" (meaning: ${word.meaning}; example: ${word.example}). Keep every reply short (under 80 words), warm, and in plain everyday English. Plain text only: no markdown, no asterisks, no bullet symbols. Stay on this word and learning it. If asked about something unrelated, steer back politely.`,
              },
            ],
          },
          contents: turns.map((m) => ({
            role: m.from === "me" ? "user" : "model",
            parts: [{ text: m.text }],
          })),
        }),
      }
    );

    if (!res.ok) {
      console.log("Chat error:", res.status, await res.text());
      return fail;
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || fail;
  } catch (err) {
    console.log("chatWithWord crashed:", err);
    return fail;
  }
}