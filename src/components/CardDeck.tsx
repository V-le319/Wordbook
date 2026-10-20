"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { Pointer } from "lucide-react";
import FlashCard from "./FlashCard";
import type { Word } from "@/lib/useWords";

const variants = {
  enter: { scale: 0.95, y: 14 },
  center: { scale: 1, y: 0 },
  exit: (dir: number) => ({
    x: dir * 500,
    opacity: 0,
    zIndex: 20,
    transition: { duration: 0.25 },
  }),
};

type SwipeCardProps = {
  word: Word;
  exitDir: number;
  progress: MotionValue<number>;
  onSwipe: (dir: number) => void;
  onDragStart: () => void;
  onTalk: (w: Word) => void;
  onRemove: (id: string) => void;
};

const SwipeCard = ({ word, exitDir, progress, onSwipe, onDragStart, onTalk, onRemove }: SwipeCardProps) => {
  const x = useMotionValue(0);

  return (
    <motion.div
      className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
      style={{ x }}
      custom={exitDir}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragStart={onDragStart}
      onDrag={(_, info) => progress.set(Math.abs(info.offset.x))}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 600) {
          onSwipe(info.offset.x > 0 ? 1 : -1);
        } else {
          progress.set(0);
        }
      }}
    >
      <FlashCard word={word} onTalk={onTalk} />
    </motion.div>
  );
};

const CardDeck = ({ words, onTalk, onRemove }: { words: Word[]; onTalk: (w: Word) => void; onRemove: (id: string) => void}) => {
  const [index, setIndex] = useState(0);
  const [exitDir, setExitDir] = useState(-1);
  const [showHint, setShowHint] = useState(true);
  const progress = useMotionValue(0);
  const behindOpacity = useTransform(progress, [0, 40], [0, 1]);

  if (words.length === 0) return null;

  if (index >= words.length) {
  setIndex(words.length - 1);
  return null;
}

  const go = (step: number, dir: number) => {
    progress.set(0);
    setExitDir(dir);
    setIndex((index + step + words.length) % words.length);
    setShowHint(false);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center gap-4">
      <div className="relative w-full flex-1 min-h-0">
        {words.length > 1 && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-0"
            style={{ opacity: behindOpacity, scale: 0.95, y: 14 }}
          >
            <FlashCard word={words[(index + 1) % words.length]} 
                      onTalk={onTalk}/>
          </motion.div>
        )}

        <AnimatePresence initial={false} custom={exitDir}>
          <SwipeCard
            key={words[index].id}
            word={words[index]}
            exitDir={exitDir}
            progress={progress}
            onSwipe={(dir) => go(1, dir)}
            onDragStart={() => setShowHint(false)}
            onTalk={onTalk}
            onRemove={onRemove}
          />
        </AnimatePresence>

        {showHint && words.length > 1 && (
          <motion.div
            className="pointer-events-none absolute bottom-20 left-1/2 z-30 -ml-3 text-light-bg/70"
            animate={{ x: [24, -24, 24] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Pointer size={28} />
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-6 text-sm text-light-bg/60">
        <button onClick={() => go(-1, 1)} className="px-3 text-lg">
          ←
        </button>
        <span>
          {index + 1} of {words.length}
        </span>
        <button onClick={() => go(1, -1)} className="px-3 text-lg">
          →
        </button>
      </div>
    </div>
  );
};

export default CardDeck;