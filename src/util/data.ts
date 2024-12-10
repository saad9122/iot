import { InvoiceType } from '@prisma/client';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const InvoiceTypeSelectData = Object.values(InvoiceType).map((type) => ({
  name: capitalize(type), // Capitalize the first letter for better display
  value: type as InvoiceType,
}));
