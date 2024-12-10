'use client';
import { Button } from '@/components/ui/button';
import { Pencil1Icon } from '@radix-ui/react-icons';
import React from 'react';

interface CustomEditButtonProps {
  onEdit?: () => void;
}

const CustomEditButton = React.forwardRef<HTMLButtonElement, CustomEditButtonProps>(({ onEdit, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      className="hover:bg-primary hover:text-white"
      type="button"
      onClick={onEdit}
      {...props}
    >
      <Pencil1Icon className="cursor-pointer" />
    </Button>
  );
});

export default CustomEditButton;
