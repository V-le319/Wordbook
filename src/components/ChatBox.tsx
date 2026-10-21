"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { chatWithWord } from "@/lib/chatWithWord";
import type { Word } from "@/lib/useWords";

type Msg = { from: "ai" | "me"; text: string; send?: string };

const chips = [
  {
    label: "Make a story",
    prompt:
      "Write a very short story (4 sentences at most) that uses this word naturally, so I remember what it means.",
  },
  {
    label: "Quiz me",
    prompt:
      "Quiz me on this word with one multiple-choice question (options A, B and C). Then wait for my answer.",
  },
  {
    label: "More examples",
    prompt:
      "Give me 3 new example sentences using this word, each in a different everyday situation.",
  },
];

const ChatBox = ({ word }: { word: Word }) => {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "ai", text: `Let’s work on “${word.text}”. Pick a chip or ask me anything.` },
  ]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const ask = async (text: string, send?: string) => {
    if (loading) return;
    const next: Msg[] = [...msgs, { from: "me", text, send }];
    setMsgs(next);
    setLoading(true);

    const reply = await chatWithWord(
      { text: word.text, meaning: word.meaning, example: word.example },
      next.map((m) => ({ from: m.from, text: m.send ?? m.text }))
    );

    setMsgs((m) => [...m, { from: "ai", text: reply }]);
    setLoading(false);
  };

  const sendTyped = () => {
    const v = value.trim();
    if (!v) return;
    setValue("");
    ask(v);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {msgs.map((m, k) => (
          <p
            key={k}
            className={cn(
              "max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed",
              m.from === "ai"
                ? "self-start rounded-bl-md bg-background"
                : "self-end rounded-br-md bg-button"
            )}
          >
            {m.text}
          </p>
        ))}
        {loading && (
          <p className="self-start rounded-2xl rounded-bl-md bg-background px-4 py-3 text-sm text-muted-foreground">
            Thinking…
          </p>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.label}
            disabled={loading}
            onClick={() => ask(c.label, c.prompt)}
            className="rounded-full border border-border px-3.5 py-2 text-sm text-primary disabled:opacity-50"
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-full bg-background py-1.5 pl-5 pr-1.5">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendTyped()}
          placeholder="Ask about this word"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          onClick={sendTyped}
          disabled={loading}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;