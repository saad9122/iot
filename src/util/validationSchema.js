import { InvoiceType } from '@prisma/client';
import * as Yup from 'yup';

export const loginFormSchema = Yup.object().shape({
  userName: Yup.string().required('userName is required'),
  password: Yup.string().required('Password is required'),
});

function decimalValidation(errorMessage, maxDecimalPlaces) {
  return Yup.number('must be number')
    .transform((value, originalValue) => {
      if (typeof originalValue === 'string') {
        return originalValue.replace(/[^\d.]/g, '');
      }
      return originalValue;
    })
    .test('decimal-places', errorMessage, (value) => {
      if (value !== undefined && value !== null && value.toString().includes('.')) {
        const decimalPlaces = value.toString().split('.')[1].length;
        return decimalPlaces <= maxDecimalPlaces;
      }
      return true;
    });
}

export const InvoiceProductFormSchema = Yup.object().shape({
  productId: Yup.string().required('Product ID is required'),
  price: Yup.number().required('Price is required').min(0.01, 'Price must be greater than zero'),
  quantity: Yup.number()
    .required('Quantity is required')
    .min(1, 'Quantity must be at least 1')
    .integer('Quantity must be an integer'),
});

export const newInvoiceProductSchema = Yup.object().shape({
  producId: Yup.string(),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').integer('Quantity must be an integer'),
  price: decimalValidation('Price must have at most two decimal places', 2).min(
    0.01,
    'Price must be greater than zero',
  ),
});

export const InvoiceFormSchema = Yup.object().shape({
  customerId: Yup.string().required('Customer is required'),
  date: Yup.string().required('Date is required'),
  paymentMethodId: Yup.string().required('Payment Method is required'),
  discount: decimalValidation('discount  must have at most two decimal places', 2)
    .min(0, 'Discount must be non-negative')
    .max(100, 'Discount must be 100 or less')
    .nullable(),
  shipment: decimalValidation('shipment  must have at most two decimal places', 2)
    .min(0, 'Shipment cost must be non-negative')
    .nullable(),
  type: Yup.string().oneOf(Object.values(InvoiceType), 'Invalid invoice type').required('Invoice type is required'),
  description: Yup.string().optional(),
  newInvoiceProduct: newInvoiceProductSchema,
  invoiceProducts: Yup.array()
    .of(Yup.mixed().required('Items are required.'))
    .min(1, 'At least one product is required'),
});

export const addProductFormSchema = Yup.object().shape({
  name: Yup.string().required('Product Name is required'),
  salePrice: decimalValidation('Price must have at most two decimal places', 2)
    .min(0.01, 'Price must be greater than zero')
    .required('sale Price is required'),
  retailPrice: decimalValidation('Price must have at most two decimal places', 2)
    .min(0.01, 'Price must be greater than zero')
    .required('retailPrice is required'),
  articleNumber: Yup.string().max(50, 'Article number is too long').nullable(),
  supplierName: Yup.string().max(100, 'Supplier name  is too long').nullable(),
  supplierArticleNumber: Yup.string().max(50, 'Supplier article number is too long').nullable(),
});

export const usersFormSchema = Yup.object().shape({
  userName: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  roleId: Yup.string().required('Role is required'),
});

export const editUsersFormSchema = Yup.object().shape({
  userName: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .required('Username is required'),
  roleId: Yup.string().required('Role is required'),
});

export const customerFormSchema = Yup.object().shape({
  name: Yup.string().max(100, 'Name must be at most 100 characters long.').required('Name is required.'),
  company: Yup.string().max(200, 'Company must be at most 200 characters long.').required('Company Name is required'),
  shopNumber: Yup.string()
    .max(50, 'Shop number must be at most 50 characters long.')
    .required('Company Name is required'),
  taxNumber: Yup.string().max(50, 'Tax number must be at most 50 characters long.'),
  address: Yup.string().max(200, 'Address must be at most 200 characters long.').required('Address is required.'),
  street: Yup.string().max(100, 'Street must be at most 100 characters long.').required('Street is required.'),
  phoneNumber: Yup.string()
    .matches(/^\d{10,15}$/, 'Phone number must be between 10 and 15 digits long.')
    .required('Phone number is required.'),
  postalCode: Yup.string().max(15, 'Postal code must be at most 15 characters long.').nullable().notRequired(),
  landlineNumber: Yup.string()
    .matches(/^\d{10,15}$/, 'Landline number must be between 10 and 15 digits long.')
    .nullable()
    .notRequired(),
  country: Yup.string().max(100, 'Country must be at most 100 characters long.').required('Country is required.'),
  city: Yup.string().max(100, 'City must be at most 100 characters long.').required('City is required.'),
  regionTypeId: Yup.string().required('Region type ID is required.'),
});

export const changePasswordFormSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Admin Password is required'),
  adminPassword: Yup.string().required('New Password is required'),
});
