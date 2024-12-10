'use client';
import { useRouter } from 'next/navigation';

const InvoiceEditButton = ({ invoice }) => {
  const router = useRouter();
  const handleEdit = () => router.push(`/invoices/edit-invoice/${invoice.id}`);

  return (
    <button onClick={handleEdit} className="w-full text-start">
      Edit Invoice
    </button>
  );
};

export default InvoiceEditButton;
