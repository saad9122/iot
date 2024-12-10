import { Customer } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import React from 'react';

type InvoiceSummaryProps = {
  selectedCustomer?: Customer;
  invoiceTax?: Decimal;
  netTotal: number;
  totalTax: number;
  grossTotal: number;
  values: {
    discount: number;
  };
};

const InvoiceDetailSummary: React.FC<InvoiceSummaryProps> = ({
  selectedCustomer,
  invoiceTax,
  netTotal,
  totalTax,
  grossTotal,
  values,
}) => {
  return (
    <div className="min-h-[200px] bg-white shadow-md rounded-lg">
      <div className="p-6">
        <div className="prose text-gray-800 mb-4">
          <h3>Customer Details</h3>
        </div>
        <div className="prose prose-sm text-gray-600">
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="font-medium">Address:</span>
              <span>{selectedCustomer?.address || 'N/A'}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Region Type:</span>
              <span>{selectedCustomer?.regionType?.name || 'N/A'}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Tax:</span>
              <span>{invoiceTax || 0} %</span>
            </li>
          </ul>
        </div>

        <div className="prose text-gray-800 mt-6 mb-4">
          <h3>Invoice Summary</h3>
        </div>
        <div className="prose prose-sm text-gray-600">
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="font-medium">Net Total:</span>
              <span>{netTotal}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Total Tax:</span>
              <span>{totalTax}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Discount:</span>
              <span>{values.discount}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Gross Total:</span>
              <span>{grossTotal}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailSummary;
