import React from 'react';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';

interface CustomDeleteButtonProps {
  onDelete?: () => void;
}

const CustomDeleteButton = React.forwardRef<HTMLButtonElement, CustomDeleteButtonProps>(
  ({ onDelete, ...props }, ref) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onDelete && onDelete();
    };

    return (
      <Button
        ref={ref}
        variant="outline"
        className="hover:bg-destructive hover:text-white"
        type="button"
        onClick={handleClick}
        {...props}
      >
        <TrashIcon className="cursor-pointer" />
      </Button>
    );
  },
);

CustomDeleteButton.displayName = 'CustomDeleteButton';

export default CustomDeleteButton;
