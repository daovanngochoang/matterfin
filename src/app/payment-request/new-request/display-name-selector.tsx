
"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CommandList } from "cmdk"



export default function DisplayNameSelector({ names, onChange }: { names: string[], onChange: (name: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(names.length > 0 ? names[0] : "")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[550px] justify-between"
        >
          {value
            ? names.find((name) => name === value)
            : "Select Display name..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[550px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {names.map((name, idx) => (
                <CommandItem
                  key={idx}
                  value={name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    onChange(name)
                  }}
                >
                  {name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}







