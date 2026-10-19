
import WordList from './WordList'
import WordItem from './WordItem'

type Tab = "cards" | "words";
type Props = {
    tab: Tab;
    setTab: (tab: Tab) => void;
}

const TabSwitcher = ({ tab, setTab }: Props) => {

  return (
    <div className='w-full  flex flex-row justify-evenly items-center border border-light-bg/60  rounded-full'>
        <WordItem label="Cards"
                    active={tab==="cards"}
                    onClick={() => setTab("cards")}/>
         <WordList label="Words"
                    active={tab==="words"}
                    onClick={() => setTab("words")}/>
    </div>
  )
}

export default TabSwitcher