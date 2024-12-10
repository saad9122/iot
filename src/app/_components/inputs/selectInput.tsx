import { useField } from 'formik';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputErrorMessage from './InputErrorMessage';

interface ISelectInput extends React.InputHTMLAttributes<HTMLInputElement> {
  data?: { name: string; value: string }[];
  label?: string;
  name: string;
  labelClass?: string;
  placeholder?: string;
  imageSrc?: string;
  containerClass?: string;
  required?: boolean;
}

const SelectInput: React.FC<ISelectInput> = ({
  label,
  labelClass,
  placeholder,
  imageSrc,
  containerClass,
  data,
  required = false,
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
        <Select onValueChange={(value: string | number) => helpers.setValue(value)} value={field.value}>
          <SelectTrigger className="text-black">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-white z-[1200]">
            {data?.map((ele) => (
              <SelectItem value={ele.value} key={ele.value}>
                {ele.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {imageSrc && <Image src={imageSrc} alt="icon" width={20} height={20} className="absolute right-2 bottom-3" />}
      </div>
      {/* {meta.touched && meta.error ? <InputErrorMessage message={meta.error} /> : null} */}
    </div>
  );
};

export default SelectInput;
