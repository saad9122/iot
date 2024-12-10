import React, { useState, useCallback } from 'react';
import { useField } from 'formik';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import InputErrorMessage from './InputErrorMessage';

interface ISelectInput extends React.InputHTMLAttributes<HTMLInputElement> {
  data?: { name: string; value: string }[];
  label?: string;
  name: string;
  labelClass?: string;
  placeholder?: string;
  imageSrc?: string;
  containerClass?: string;
  isEditing?: boolean;
  required?: boolean;
  onValueChange: (value: string) => void;
}

const SelectInputWithSearch: React.FC<ISelectInput> = ({
  label,
  labelClass,
  placeholder,
  imageSrc,
  containerClass,
  data = [],
  required = false,
  isEditing = false,
  onValueChange,
  ...props
}) => {
  const [field, meta, helpers] = useField(props.name);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Ensure data is an array
  const items = Array.isArray(data) ? data : [];

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);
  const handleSelect = (item: { name: string; value: string }) => {
    if (onValueChange) {
      onValueChange(item.value);
    }
    helpers.setValue(item.value);
    setOpen(false);
  };

  return (
    <div className={`space-y-2 ${containerClass}`}>
      {label && (
        <Label htmlFor={props.name} className={labelClass}>
          {label} {required && <sup className="text-red-500 text-xs">*</sup>}
        </Label>
      )}
      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
              {field.value ? items.find((item) => item.value === field.value)?.name : placeholder || `Select ${label}`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search..." onValueChange={handleSearch} />
              <CommandList>
                <CommandEmpty>No item found.</CommandEmpty>
                <CommandGroup>
                  {filteredItems.map((item) => (
                    <CommandItem key={item.value} value={item.name} onSelect={() => handleSelect(item)}>
                      <Check className={cn('mr-2 h-4 w-4', field.value === item.value ? 'opacity-100' : 'opacity-0')} />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {imageSrc && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Image src={imageSrc} alt="icon" width={20} height={20} />
          </div>
        )}
      </div>

      {/* {meta.touched && meta.error ? <InputErrorMessage message={meta.error} /> : null} */}
    </div>
  );
};

export default SelectInputWithSearch;
