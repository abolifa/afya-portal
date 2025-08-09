"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "اختر",
}: Props) {
  const [open, setOpen] = useState(false);

  const selected = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
          >
            {selected?.label || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="p-0  overflow-y-auto">
        <Command className="overflow-y-auto">
          <CommandInput placeholder="ابحث..." className="h-9" />
          <CommandEmpty>لم يتم العثور على نتائج.</CommandEmpty>
          <CommandGroup>
            {options.map((opt, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    opt.value === value ? "opacity-100" : "opacity-0"
                  )}
                />
                {opt.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
