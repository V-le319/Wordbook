"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatBox from "./ChatBox";
import VoiceBox from "./VoiceBox";
import type { Word } from "@/lib/useWords";

type Props = { word: Word | null; onClose: () => void };

const AiChatSheet = ({ word, onClose }: Props) => {
  const [mode, setMode] = useState<"type" | "talk">("type");

  const close = () => {
    setMode("type");
    onClose();
  };

  return (
    <AnimatePresence>
      {word && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.section
            key="sheet"
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[86dvh] w-full max-w-md flex-col gap-4 rounded-t-3xl bg-card px-5 pb-6 pt-3"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-border" />

            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-3xl text-light-bg">{word.text}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{word.meaning}</p>
              </div>
              <button onClick={close} aria-label="Close" className="p-1 text-muted-foreground">
                <X size={22} />
              </button>
            </div>

            <div className="flex rounded-full bg-background p-1">
              {(["type", "talk"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "flex-1 rounded-full py-2 text-sm capitalize transition-colors",
                    mode === m ? "bg-button text-light-bg" : "text-muted-foreground"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>

            {mode === "type" ? (
              <ChatBox key={word.id} word={word} />
            ) : (
              <VoiceBox key={word.id} word={word} />
            )}
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
};

export default AiChatSheet;