import { cn } from "@/lib/utils";
import type { Word } from "@/lib/useWords";
import { useState } from "react";

const FlashCard = ({ word }: { word: Word }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="h-full w-full  cursor-pointer perspective-distant"
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-500 transform-3d",
          flipped && "rotate-y-180"
        )}
      >
        {/* front */}
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl  bg-font-card backface-hidden">
          <h2 className="font-serif text-5xl lg:text-6xl text-foreground">{word.text}</h2>
          <p className="absolute bottom-6 text-sm text-muted-foreground">Tap to flip</p>
        </div>

        {/* back */}
<div className="absolute inset-0 flex rotate-y-180 flex-col justify-center gap-4 rounded-3xl bg-light-bg p-10 backface-hidden">
  <div>
    <h2 className="font-serif text-3xl lg:text-4xl leading-tight text-background">{word.meaning}</h2>
    <p className="mt-1 text-sm text-background/50">{word.partOfSpeech}</p>
  </div>

  <div className="border-l-2 border-primary pl-4">
    <p className="text-base text-background">{word.example}</p>
    <p className="text-sm italic text-background/50">Meaning: {word.exampleTranslation}</p>
  </div>

  <p className="text-base text-background/70">{word.note}</p>
</div>
      </div>
    </div>
  )
}

export default FlashCard