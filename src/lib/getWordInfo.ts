"use server";
//Ai for meaning and words example

export type WordInfo = {
  meaning: string;
  partOfSpeech: string;
  example: string;
  exampleTranslation: string;
  note: string;
};

const MODEL = "gemini-3.5-flash-lite";

export async function getWordInfo(word: string): Promise<WordInfo | null> {
  try {
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
                text: "You are the dictionary inside a vocabulary flashcard app. Reply with JSON only.",
              },
            ],
          },
          contents: [
            {
              parts: [
                {
                  text: `Word: "${word}"

Return this JSON:
{
  "meaning": "short plain-English meaning, under 12 words, lowercase, no final period",
  "partOfSpeech": "noun, verb, adjective...",
  "example": "one natural sentence using the word",
  "exampleTranslation": "the same example reworded in simple everyday words",
  "note": "1 or 2 sentences: how it is used, plus pronunciation like in-EF-uh-bul"
}

If it is not a real word, return {"error": "not a word"}.`,
                },
              ],
            },
          ],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!res.ok) {
      console.log("Gemini error:", res.status, await res.text());
      return null;
}
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    if (parsed.error) return null;
    return parsed as WordInfo;
  } catch (err) {
  console.log("getWordInfo crashed:", err);
  return null;
}
}