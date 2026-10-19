'use client'

import AddWordBar from "@/components/AddWordBar";
import FlashCard from "@/components/FlashCard";
import Login from "@/components/Login";
import TabSwitcher from "@/components/TabSwitcher";
import WordListCard from "@/components/WordListCard";
import { useState } from "react";
import { useWords } from "@/lib/useWords";
import CardDeck from "@/components/CardDeck";



export default function Home() {
        const [tab, setTab] = useState<"cards" | "words">("cards");
        const { words, addWord }= useWords()
  return (
   <main className="h-screen w-full px-10 py-6 lg:px-56 lg:py-10 bg-bg flex flex-col gap-6 lg:gap-10 justify-center items-center">
        <div className="w-full flex flex-row justify-between items-center">
          <h1 className="font-serif font-bold text-2xl lg:text-3xl">Wordbook</h1>
          <Login/>
        </div>

      <div className="w-full flex flex-col items-center gap-10 justify-center">
        <TabSwitcher tab={tab}
                      setTab={setTab}
                      />
        <div className="w-full lg:w-2/3">
          {tab === "cards" ?  <CardDeck words={words} /> : <WordListCard words={words}/>}
        </div>
      </div>

        

        <AddWordBar onAdd={addWord}/>
    </main>
  );
}
