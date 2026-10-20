import { cn } from "@/lib/utils";
import type { Word } from "@/lib/useWords";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const FlashCard = ({ word, onTalk, onRemove }: { word: Word; onTalk?: (w: Word) => void; onRemove?: (id: string) => void; }) => {
  const [flipped, setFlipped] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!confirm) return;
    const t = setTimeout(() => setConfirm(false), 3000);
    return () => clearTimeout(t);
  }, [confirm]);


  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="relative h-full w-full  cursor-pointer perspective-distant"
    >
      

      <div
        className={cn(
          "relative h-full w-full transition-transform duration-500 transform-3d",
          flipped && "rotate-y-180"
        )}
      >
        {/* front */}
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl  bg-font-card backface-hidden">
          {onRemove && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (confirm) onRemove(word.id);
      else setConfirm(true);
    }}
    aria-label={confirm ? "Confirm delete" : "Delete word"}
    className={cn(
      "absolute right-4 top-4 z-10 flex h-10 min-w-10 items-center justify-center gap-1 rounded-full border text-sm transition-colors",
      confirm
        ? "border-destructive px-3 text-destructive"
        : "border-muted-foreground/50 text-muted-foreground"
    )}
  >
    <Trash2 size={18} />
    {confirm && "Delete?"}
  </button>
)}
          
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

  <button onClick={(e) => {
          e.stopPropagation();
          onTalk?.(word);
          }}
        className="self-start rounded-full hover:bg-primary/30 hover:border hover:border-button duration-300 cursor-pointer hover:text-bg bg-button px-5 py-3 text-sm font-medium text-light-bg"
    >
        Talk about this word
    </button>

</div>
      </div>
    </div>
  )
}

export default FlashCard