'use client'

import { Input } from "./ui/input"
import { Button } from "./ui/button";
import { useState } from "react";

type Props = {
  onAdd: (text: string) => void;
};

const AddWordBar = ({ onAdd }: Props) => {
  const [value, setValue] = useState("");

  const handleAdd = () => {
      if (!value.trim()) return;
      onAdd(value.trim());
      setValue("");
  }

  return (
    <div className='w-full pl-6 flex justify-between items-center py-3 px-4 bg-font-card rounded-full'>
      <Input value={value}
    onChange={(e) => setValue(e.target.value)}
    onKeyDown={(e) => {
        if (e.key === "Enter") handleAdd();
      }}
    placeholder="Add a word you just saw"
    className="h-auto flex-1 lg:text-lg rounded-none border-0! bg-transparent! p-0! text-base shadow-none! ring-0! focus-visible:ring-0!"/>
      <Button   onClick={handleAdd}
                className="px-5 text-bg font-medium font-sans tracking-wide">
        Add
        </Button>
      </div>
  )
}

export default AddWordBar