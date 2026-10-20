import type { Word } from "@/lib/useWords";

const WordListCard = ( { words } : { words: Word[] }) => {
  return (
    <main className='no-scrollbar h-full overflow-y-auto w-full py-6 flex flex-col'>
      <div className='flex flex-row gap-2 items-center mb-8'>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="4" fill="#8fbc9f" />
        </svg>
        <p className='text-sm font-sans text-light-bg/60'>Saved on this device only</p>
      </div>

      {words.map((word) => (
        <div key={word.id}
              className="w-full py-8 flex flex-row gap-16 items-baseline justify-between border-t border-t-light-bg/20"
          >
            <p className="font-serif text-light-bg font-medium text-xl lg:text-2xl tracking-wide">{word.text}</p>
            <p className="text-base text-light-bg/80">{word.meaning}</p>
        </div>
        ))}

    </main>
  )
}

export default WordListCard