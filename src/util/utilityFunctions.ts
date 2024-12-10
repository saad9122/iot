import { INewInvoiceProduct } from '@/app/_types/interfaces';
import { customAlphabet } from 'nanoid';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
export const generateResponse = <T>(status: boolean, message: string, data: T = {} as T): ApiResponse<T> => {
  return {
    success: status,
    message: message,
    data: data,
  };
};

export const generateErrorResponse = (message: string, data: any = {}) => {
  return {
    success: false,
    message: message,
    data: data,
  };
};

interface IInvoiceCalculations {
  products: INewInvoiceProduct[];
  discount: number;
  tax: number;
  shipment: number;
}

export const invoiceCalculations = ({
  products,
  discount,
  tax,
  shipment,
}: IInvoiceCalculations): {
  netTotal: number;
  grossTotal: number;
  totalTax: number;
  totalDiscount: number;
} => {
  const netTotal =
    products?.reduce((total, product) => total + product?.price * (product?.quantity ? product?.quantity : 1), 0) || 0;

  const totalTax = tax ? netTotal * (tax / 100) : 0;

  const totalDiscount = discount ? netTotal * (discount / 100) : 0;

  const grossTotal = netTotal + totalTax - totalDiscount + shipment;

  return {
    netTotal: parseFloat(netTotal.toFixed(2)),
    grossTotal: parseFloat(grossTotal.toFixed(2)),
    totalTax: parseFloat(totalTax.toFixed(2)),
    totalDiscount: parseFloat(totalDiscount.toFixed(2)),
  };
};
export function checkPriceInput(num: number, text: string = 'Price'): { isError: boolean; message: string } {
  let numStr = num.toString();

  if (num <= 0) {
    return { isError: true, message: `${text} must be bigger than zero` };
  }

  if (numStr.includes('.')) {
    let decimalPart = numStr.split('.')[1];
    if (decimalPart.length > 2) {
      return { isError: true, message: `${text} must have at most two decimal places` };
    }
  }

  return { isError: false, message: '' };
}

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 21);

export function generateShortUUID(): string {
  return nanoid();
}

export function generateInvoiceId(inputNumber: number): string {
  const currentDate = new Date();
  const year = String(currentDate.getFullYear()).slice(-2);
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const paddedNumber = String(inputNumber).padStart(4, '0');
  return `${year}${month}${paddedNumber}`;
}

export function findHighestInvoiceNumber(arr: number[]): number {
  if (arr.length === 0) return 0;

  const maxNumber = Math.max(...arr);
  const removedIntialZeros = parseInt(maxNumber.toString(), 10);

  return isNaN(removedIntialZeros) ? 0 : removedIntialZeros;
}
