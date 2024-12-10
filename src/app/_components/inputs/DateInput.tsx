import { useField } from 'formik';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import InputErrorMessage from './InputErrorMessage';

interface IDateInput extends React.InputHTMLAttributes<HTMLInputElement> {
  data?: { name: string; value: string }[];
  label?: string;
  name: string;
  labelClass?: string;
  placeholder?: string;
  imageSrc?: string;
  containerClass?: string;
  required?: false;
}

const DateInput: React.FC<IDateInput> = ({
  label,
  labelClass,
  placeholder,
  imageSrc,
  containerClass,
  required = false,
  data,
  ...props
}) => {
  const [field, meta, helpers] = useField(props.name);

  return (
    <div className={`space-y-2 ${containerClass}`}>
      {label && (
        <Label htmlFor={props.name}>
          {label} {required && <sup className="text-red-500 text-xs">*</sup>}
        </Label>
      )}

      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn('w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={field.value} onSelect={helpers.setValue} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
      {/* {meta.touched && meta.error ? <InputErrorMessage message={meta.error} /> : null} */}
    </div>
  );
};

export default DateInput;
