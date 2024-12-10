import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Invoice } from '@prisma/client';
import React from 'react';

const InvoicePrintButton = ({ invoice }: { invoice: Invoice }) => {
  const handlePrint = (invoice) => {
    const printWindow = window.open();
    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Invoice ${invoice.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary-color: #007bff; /* A professional blue */
                --secondary-color: #6c757d; /* Grey */
                --border-color: #dee2e6;
                --background-color: #f8f9fa; /* Light grey */
                --text-color: #212529; /* Dark text */
            }
    
            body {
                font-family: 'Roboto', sans-serif;
                margin: 0;
                padding: 40px;
                color: var(--text-color);
                line-height: 1.5;
                background-color: white;
            }
    
            .container {
                max-width: 850px;
                margin: 0 auto;
                background: white;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                padding: 40px;
                border-radius: 10px;
            }
    
            .invoice-header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 2px solid var(--border-color);
            }
    
            .invoice-header h1 {
                margin: 0;
                font-size: 36px;
                color: var(--primary-color);
            }
    
            .invoice-header h2 {
                margin: 10px 0 0;
                color: var(--secondary-color);
                font-size: 22px;
                font-weight: 500;
            }
    
            .invoice-type {
                background-color: ${invoice.type === 'Return' ? '#f8d7da' : '#d4edda'};
                color: ${invoice.type === 'Return' ? '#721c24' : '#155724'};
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 14px;
                margin-top: 10px;
                display: inline-block;
            }
    
            .invoice-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 40px;
            }
    
            .invoice-details-group {
                background-color: var(--background-color);
                padding: 24px;
                border-radius: 6px;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            }
    
            .invoice-details-group h3 {
                margin: 0 0 16px;
                color: var(--primary-color);
                font-size: 16px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
    
            .invoice-details-group p {
                margin: 8px 0;
                color: var(--text-color);
            }
    
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin: 32px 0;
                background: white;
            }
    
            .items-table th {
                background-color: var(--background-color);
                padding: 16px;
                text-align: left;
                font-weight: 600;
                color: var(--primary-color);
                border-bottom: 2px solid var(--border-color);
            }
    
            .items-table td {
                padding: 16px;
                border-bottom: 1px solid var(--border-color);
            }
    
            .items-table tr:last-child td {
                border-bottom: none;
            }
    
            .items-table th:last-child,
            .items-table td:last-child {
                text-align: right;
            }
    
            .summary {
                display: grid;
                grid-template-columns: 1fr 300px;
                margin-top: 32px;
                border-top: 2px solid var(--border-color);
                padding-top: 16px;
            }
    
            .summary-details p {
                margin: 8px 0;
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
            }
    
            .summary-details .total {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 2px solid var(--border-color);
                font-weight: bold;
                color: var(--primary-color);
                font-size: 1.3em;
            }
    
            .summary-details .discount {
                color: #28a745; /* Green for discount */
            }
    
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid var(--border-color);
                text-align: center;
                color: var(--secondary-color);
                font-size: 14px;
            }
    
            @media print {
                body {
                    padding: 0;
                    background: white;
                }
                .container {
                    box-shadow: none;
                    padding: 20px;
                }
                @page {
                    margin: 0.5cm;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="invoice-header">
                <h1>INVOICE</h1>
                <h2>#${invoice.id}</h2>
                <div class="invoice-type">${invoice.type}</div>
            </div>
            
            <div class="invoice-details">
                <div class="invoice-details-group">
                    <h3>Bill To</h3>
                    <p><strong>${invoice.customer.name}</strong></p>
                    <p>Tax Number: ${invoice.customer.taxNumber}</p>
                    <p>${invoice.address}</p>
                </div>
                <div class="invoice-details-group">
                    <h3>Invoice Information</h3>
                    <p><strong>Date:</strong> ${invoice.invoiceDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</p>
                    <p><strong>Payment Method:</strong> ${invoice.paymentMethod.name}</p>
                </div>
            </div>
    
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.invoiceProducts
                      .map(
                        (product) => `
                            <tr>
                                <td>${product.product.name}</td>
                                <td>${product.quantity}</td>
                                <td>$${Number(product.price).toFixed(2)}</td>
                                <td>$${Number(product.price * product.quantity).toFixed(2)}</td>
                            </tr>
                        `,
                      )
                      .join('')}
                </tbody>
            </table>
    
            <div class="summary">
                <div></div>
                <div class="summary-details">
                    <p>
                        <span>Subtotal:</span>
                        <span>$${Number(invoice.netTotal).toFixed(2)}</span>
                    </p>
                    <p>
                        <span>Shipping:</span>
                        <span>$${invoice.shipment ? Number(invoice.shipment).toFixed(2) : 0.0}</span>
                    </p>
                    <p class="discount">
                        <span>Discount:</span>
                        <span>-$${invoice.discount ? Number(invoice.discount).toFixed(2) : 0.0}</span>
                    </p>
                    <p>
                        <span>Tax:</span>
                        <span>$${invoice.tax}</span>
                    </p>
                    <p class="total">
                        <span>Total Amount:</span>
                        <span>$${invoice.grossTotal}</span>
                    </p>
                </div>
            </div>
    
            <div class="footer">
                Thank you for your business!
            </div>
        </div>
    </body>
    </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.print();

      printWindow.onafterprint = function () {
        printWindow.close();
      };
    };
  };
  return (
    <DropdownMenuItem onClick={() => handlePrint(invoice)} className="cursor-pointer">
      Print
    </DropdownMenuItem>
  );
};

export default InvoicePrintButton;
