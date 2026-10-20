"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Word } from "@/lib/useWords";

type Msg = { from: "ai" | "me"; text: string };

const chips = [
  {
    label: "Make a story",
    reply: (w: Word) =>
      `Here’s a tiny story to help it stick. Lena watched the lights go out one by one, and what she felt was ${w.text}.\n\n“${w.text}” means: ${w.meaning}.`,
  },
  {
    label: "Quiz me",
    reply: (w: Word) =>
      `Which sentence uses “${w.text}” correctly?\n\nA) ${w.example}\nB) He ate a ${w.text} for lunch.`,
  },
  {
    label: "More examples",
    reply: (w: Word) => `1. ${w.example}\n2. Another example with “${w.text}” will appear here.`,
  },
];

const ChatBox = ({ word }: { word: Word }) => {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "ai", text: `Let’s work on “${word.text}”. Pick a chip or ask me anything.` },
  ]);
  const [value, setValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const ask = (question: string, answer: string) => {
    setMsgs((m) => [...m, { from: "me", text: question }]);
    setTimeout(() => setMsgs((m) => [...m, { from: "ai", text: answer }]), 500);
  };

  const send = () => {
    const v = value.trim();
    if (!v) return;
    setValue("");
    ask(v, `The real AI answers here, already knowing “${word.text}”.`);
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
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.label}
            onClick={() => ask(c.label, c.reply(word))}
            className="rounded-full border border-border px-3.5 py-2 text-sm text-primary"
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-full bg-background py-1.5 pl-5 pr-1.5">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about this word"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button onClick={send} className="rounded-full bg-primary px-4 py-2 text-sm font-medium cursor-pointer text-background">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;