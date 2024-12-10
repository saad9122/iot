const { Decimal } = require('@prisma/client');
import { generateInvoiceId, generateShortUUID } from '../../src/util/utilityFunctions';
import { Product, Customer, Invoice, PaymentMethod, InvoiceProduct, RegionType } from '@prisma/client';

const generateRandomDecimal = (min: number, max: number) => {
  const value = (Math.random() * (max - min) + min).toFixed(2);
  return value;
};

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomInvoiceNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const regionTypeSeeders: RegionType[] = Array.from({ length: 2 }, (_, index) => ({
  id: index + 1,
  name: index === 1 ? 'Inland' : 'Export',
  tax: index === 1 ? new Decimal(0.0) : new Decimal(19.0),
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export const paymentMethodSeeders: PaymentMethod[] = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  name: index === 1 ? 'Cash' : index === 2 ? 'Card' : 'Cheque',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

// Generate an array of 31 product objects
export const productSeeders: Product[] = Array.from({ length: 31 }, (_, index) => ({
  id: generateShortUUID(),
  name: `Product ${index + 1}`,
  retailPrice: new Decimal(generateRandomDecimal(10, 100)),
  salePrice: new Decimal(generateRandomDecimal(10, 100)),
  articleNumber: `Artical ${index}`,
  supplierName: `Sup ${index}`,
  supplierArticleNumber: `SupArt ${index}`,
  createdBy: 1,
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export const customersSeeders: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>[] = Array.from(
  { length: 6 },
  (_, index) => ({
    name: `Customer ${index + 1}`,
    company: `Company ${index + 1}`, // Added company field
    shopNumber: `${index + 1}`, // Added shopNumber field
    taxNumber: Math.random() > 0.5 ? `${Math.floor(Math.random() * 1000000000) + 1000000000}` : null, // Added taxNumber field
    address: `${Math.floor(Math.random() * 1000) + 1} Random Street ${index + 1}`,
    street: `${Math.floor(Math.random() * 1000) + 1} Elm Street ${index + 1}`,
    phoneNumber: `${Math.floor(Math.random() * 900000000) + 100000000}`, // Ensure this fits the length constraint (e.g., 15 characters)
    postalCode: Math.random() > 0.5 ? `${Math.floor(Math.random() * 90000) + 10000}` : null, // Added postalCode field
    landlineNumber: Math.random() > 0.5 ? `${Math.floor(Math.random() * 900000000) + 100000000}` : null, // Added landlineNumber field
    country: 'USA', // Added country field
    city: 'New York',
    regionTypeId: index % 2 === 1 ? 1 : 2, // Adjust to your actual regionType IDs
    note: `Note for Customer ${index + 1}`, // Added note field
    isDeleted: false,
    createdBy: 1,
  }),
);

export const invoicesSeeder: Omit<Invoice, 'createdAt' | 'updatedAt'>[] = Array.from({ length: 4 }, (_, index) => {
  const discount = new Decimal(generateRandomDecimal(10, 100));
  const netTotal = new Decimal(generateRandomDecimal(500, 1000));
  const tax = new Decimal(generateRandomDecimal(5, 50));
  const shipment = new Decimal(generateRandomDecimal(5, 30));

  const grossTotal = Number(netTotal) + Number(tax) + Number(discount) + Number(shipment);

  return {
    id: generateInvoiceId(index + 1),
    invoiceDate: generateRandomDate(new Date(2023, 0, 1), new Date(2024, 0, 1)),
    address: `${Math.floor(Math.random() * 1000) + 1} Random Street ${index + 1}`,
    shipment,
    discount,
    tax,
    type: index % 2 === 1 ? 'Invoice' : 'Return',
    netTotal, // Amount without tax and discount
    grossTotal: new Decimal(grossTotal), // Amount with tax
    description: `description ${index}`,
    isDeleted: false,
    createdBy: 1,
    customerId: Math.floor(Math.random() * 5) + 1,
    paymentMethodId: Math.floor(Math.random() * 3) + 1,
  };
});

export const invoiceProductOneSeeders: Omit<InvoiceProduct, 'invoiceId'>[] = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  price: new Decimal(generateRandomDecimal(10, 100)),
  quantity: Math.floor(Math.random() * 5) + 1,
  productId: '',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export const invoiceProductTwoSeeders: Omit<InvoiceProduct, 'invoiceId'>[] = Array.from({ length: 2 }, (_, index) => ({
  id: index + 4,
  price: new Decimal(generateRandomDecimal(10, 100)),
  quantity: Math.floor(Math.random() * 5) + 1,
  productId: '',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}));
export const invoiceProductThreeSeeders: Omit<InvoiceProduct, 'invoiceId'>[] = Array.from(
  { length: 2 },
  (_, index) => ({
    id: index + 6,
    price: new Decimal(generateRandomDecimal(10, 100)),
    quantity: Math.floor(Math.random() * 5) + 1,
    productId: '',
    isDeleted: false, 
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
);
export const invoiceProductFourSeeders: Omit<InvoiceProduct, 'invoiceId'>[] = Array.from({ length: 2 }, (_, index) => ({
  id: index + 8,
  price: new Decimal(generateRandomDecimal(10, 100)),
  quantity: Math.floor(Math.random() * 5) + 1,
  productId: '',
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}));
