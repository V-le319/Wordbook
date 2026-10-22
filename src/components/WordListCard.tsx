import type { Word } from "@/lib/useWords";

const WordListCard = ( { words } : { words: Word[] }) => {
  return (
    <main className='no-scrollbar h-full overflow-y-auto w-full py-6 flex flex-col'>
      

      {words.map((word) => (
        <div key={word.id}
              className="w-full py-8 flex flex-row gap-16 items-baseline justify-between border-t border-t-light-bg/20 first:border-t-0"
          >
            <p className="font-serif text-light-bg font-medium text-xl lg:text-2xl tracking-wide">{word.text}</p>
            <p className="text-base text-light-bg/80">{word.meaning}</p>
        </div>
        ))}

    </main>
  )
}

export default WordListCard