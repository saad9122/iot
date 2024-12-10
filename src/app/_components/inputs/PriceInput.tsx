import { useField } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import InputErrorMessage from './InputErrorMessage';

interface PriceInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  labelClass?: string;
  placeholder?: string;
  imageSrc?: string;
  containerClass?: string;
  required?: boolean;
}

const PriceInput: React.FC<PriceInputProps> = ({
  label,
  labelClass,
  placeholder,
  imageSrc,
  containerClass,
  required = false,
  ...props
}) => {
  const [field, meta] = useField(props.name);

  return (
    <div className={`space-y-2 ${containerClass}`}>
      {label && (
        <Label htmlFor={props.name}>
          {label} {required && <sup className="text-red-500 text-xs">*</sup>}
        </Label>
      )}

      <div className="relative">
        <Input
          type="number"
          id={props.name}
          placeholder={placeholder ? placeholder : ''}
          pattern="^\d+(?:\.\d{1,2})?$"
          {...field}
          {...props}
          className="px-4 py-2"
        />
        {imageSrc && <Image src={imageSrc} alt="icon" width={20} height={20} className="absolute right-2 bottom-3" />}
      </div>
      {/* {meta.touched && meta.error ? <InputErrorMessage message={meta.error} /> : null} */}
    </div>
  );
};

export default PriceInput;
