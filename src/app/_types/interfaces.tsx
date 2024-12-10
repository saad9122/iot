import { Product, Customer } from '@prisma/client';

export interface IResponse {
  success: boolean;
  message: string;
}

export interface IErrorResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface IUserSignin {
  id: number;
  userName: string;
  role: {
    id: number;
    name: string;
  };
  token?: string;
}

export interface IUserInfo extends IResponse {
  data: IUserSignin;
}

export interface IProductsResponse extends IResponse {
  data: Product[];
}

export interface ICustomersResponse extends IResponse {
  data: Customer[];
}

export interface ICustomer {
  id: string;
  name: string;
}

export interface IPaymentMethods {
  id: string;
  name: string;
}

export interface IProducts {
  id: string;
  name: string;
}

export interface FormProps<T> {
  handleCloseForm?: () => void;
  isEditing?: boolean;
  data?: T;
  select1Data?: { name: string; value: string }[];
}

export interface INewInvoiceProduct {
  invoiceProductId?: number;
  productId: string;
  price: number;
  quantity: number | null;
}
