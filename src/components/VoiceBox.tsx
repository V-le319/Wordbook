"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import type { Word } from "@/lib/useWords";

const VoiceBox = ({ word }: { word: Word }) => {
  const [live, setLive] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <button
        onClick={() => setLive(!live)}
        aria-label={live ? "Stop" : "Start talking"}
        className="relative grid size-24 shrink-0 place-items-center rounded-full bg-primary text-background"
      >
        {live && <span className="absolute inset-0 animate-ping rounded-full border-2 border-primary" />}
        <Mic size={34} className="relative" />
      </button>
      <p className="text-light-bg">{live ? "Listening…" : "Tap to talk about this word"}</p>
      {live && <p className="max-w-xs text-sm text-muted-foreground">Try saying: “{word.example}”</p>}
    </div>
  );
};

export default VoiceBox;