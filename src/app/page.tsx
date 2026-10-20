'use client'

import AddWordBar from "@/components/AddWordBar";
import FlashCard from "@/components/FlashCard";
import Login from "@/components/Login";
import TabSwitcher from "@/components/TabSwitcher";
import WordListCard from "@/components/WordListCard";
import { useState } from "react";
import CardDeck from "@/components/CardDeck";
import AiChatSheet from "@/components/AiChatSheet";
import { useWords, type Word } from "@/lib/useWords";



export default function Home() {
        const [tab, setTab] = useState<"cards" | "words">("cards");
        const { words, addWord, removeWord }= useWords();
        const [chatWord, setChatWord] = useState<Word | null>(null);

  return (
   <main className="h-screen w-full px-10 lg:px-56 py-10 bg-bg flex flex-col gap-6 lg:gap-10 justify-center items-center">
        <div className="w-full shrink-0 flex flex-row justify-between items-center">
          <h1 className="font-serif font-bold text-2xl lg:text-3xl">Wordbook</h1>
          <Login/>
        </div>

      <div className="w-full flex-1 min-h-0  flex flex-col items-center gap-6">
        <TabSwitcher tab={tab}
                      setTab={setTab}
                      />
        <div className="relative w-full lg:w-2/3 flex-1 min-h-0">
          {tab === "cards" ?  <CardDeck words={words} onTalk={setChatWord} onRemove={removeWord}/> 
            : <WordListCard words={words}/>}
        </div>
      </div>

        <AddWordBar onAdd={addWord}/>
        <AiChatSheet word={chatWord} onClose={() => setChatWord(null)} />
    </main>
  );
}
