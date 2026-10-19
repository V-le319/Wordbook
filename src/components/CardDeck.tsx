"use client";

import { useState } from "react";
import FlashCard from "./FlashCard";
import type { Word } from "@/lib/useWords";

const CardDeck = ({ words }: { words: Word[] }) => {
  const [index, setIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  if (words.length === 0) return null;

  const next = () => setIndex((i) => Math.min(i + 1, words.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
    setStartX(null);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        className="w-full"
        onTouchStart={(e) => setStartX(e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <FlashCard key={words[index].id} word={words[index]} />
      </div>

      <div className="flex items-center gap-6 text-sm text-light-bg/60">
        <button onClick={prev} disabled={index === 0} className="px-3 text-lg disabled:opacity-30">
          ←
        </button>
        <span>
          {index + 1} of {words.length}
        </span>
        <button
          onClick={next}
          disabled={index === words.length - 1}
          className="px-3 text-lg disabled:opacity-30"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default CardDeck;