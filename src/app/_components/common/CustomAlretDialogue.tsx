import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

type AddProductButtonProps = {
  ButtonComponent: React.ReactNode;
  FormComponent: React.ComponentType<{ handleCloseForm?: () => void }>;
  formHeading: string;
  contentClass?: string;
};
const CustomAlert: React.FC<AddProductButtonProps> = ({
  ButtonComponent,
  FormComponent,
  formHeading,
  contentClass,
}) => {
  const customClass = contentClass ? contentClass : 'sm:max-w-[425px]';
  const [showProductForm, setShowProductForm] = useState(false);

  const handleCloseForm = () => {
    setShowProductForm(false);
  };
  return (
    <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
      <DialogTrigger asChild>{ButtonComponent}</DialogTrigger>
      <DialogContent className={`${customClass}`}>
        <DialogHeader>
          <DialogTitle>{formHeading}</DialogTitle>
        </DialogHeader>
        <FormComponent handleCloseForm={handleCloseForm} />
      </DialogContent>
    </Dialog>
  );
};

export default CustomAlert;
