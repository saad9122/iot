'use client';
import { Button } from '@/components/ui/button';
import { Pencil1Icon } from '@radix-ui/react-icons';
import React from 'react';

interface CustomEditButtonProps {
  onPasswordChange?: () => void;
}

const ChangePasswordButton = React.forwardRef<HTMLButtonElement, CustomEditButtonProps>(
  ({ onPasswordChange, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className="hover:bg-primary hover:text-white"
        type="button"
        onClick={onPasswordChange}
        {...props}
      >
        Change Password
      </Button>
    );
  },
);

export default ChangePasswordButton;
