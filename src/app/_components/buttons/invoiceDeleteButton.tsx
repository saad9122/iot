import React from 'react';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ApiResponse } from '@/util/utilityFunctions';

interface InvoiceDeleteContectProps {
  onDelete: () => Promise<ApiResponse<{}>>;
  isPermenantDelte: boolean;
}

const InvoiceDeleteButton: React.FC<InvoiceDeleteContectProps> = ({ onDelete, isPermenantDelte }) => {
  const handleDelete = () => {
    onDelete();
  };
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        { isPermenantDelte && <AlertDialogDescription>
          This action cannot be }undone. This will permanently delete your invoice and remove your data from our servers.
        </AlertDialogDescription>
        }
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default InvoiceDeleteButton;
