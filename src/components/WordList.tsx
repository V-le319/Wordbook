import { cn } from "@/lib/utils";

type Props = {
  label: "Words";
  active: boolean;
  onClick: () => void;
}

const WordList = ({ label, active, onClick } : Props) => {
  return (
    <button onClick={onClick}
            className={cn(
              "flex-1 rounded-full py-3 text-base transition-colors",
              active ? "bg-light-bg text-bg font-medium" : "text-light-bg/60"
            )}>
      <h1 className='font-sans text-base tracking-wide'>
        {label}
      </h1>
    </button>
  )
}

export default WordList