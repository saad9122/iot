'use clinet';
import { IErrorResponse } from '@/app/_types/interfaces';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/util/utilityFunctions';
import { useState, useTransition } from 'react';
import CustomDeleteButton from './CustomDeleteButton';

export function DeleteButton({
  onDelete,
  text,
}: {
  onDelete: () => Promise<ApiResponse<{}> | IErrorResponse>;
  text?: string;
}) {
  const [showProductForm, setShowProductForm] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();
  const handleDelete = () => {
    startTransition(async () => {
      try {
        const response: ApiResponse<{}> | IErrorResponse = await onDelete();

        if (!response?.success) {
          throw new Error(response?.message || 'Failed to add product');
        }
        toast({
          title: response.message,
          variant: 'default',
        });

        setShowProductForm(false);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error deleting product',
          description: (error as Error).message || 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <AlertDialog open={showProductForm} onOpenChange={setShowProductForm}>
      <AlertDialogTrigger asChild>{text ? <button>{text}</button> : <CustomDeleteButton />}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button disabled={isPending} onClick={handleDelete}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
