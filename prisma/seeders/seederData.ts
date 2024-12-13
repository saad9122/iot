const { Decimal } = require('@prisma/client');
import { generateInvoiceId, generateShortUUID } from '../../src/util/utilityFunctions';

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