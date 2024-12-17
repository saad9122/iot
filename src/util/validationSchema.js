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

export const deviceSchema = Yup.object({
  name: Yup.string().required('Device name is required'),
  macAddress: Yup.string()
    .matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC address format')
    .required('MAC address is required'),
  location: Yup.string().optional(),
  description: Yup.string().optional(),
  setTemperature: Yup.number().optional(),
  reverseRelay: Yup.boolean().default(false),
});

export const sensorDataSchema = Yup.object({
  macAddress: Yup.string()
    .matches(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'Invalid MAC address format')
    .required('MAC address is required'),

  temperature: Yup.number()
    .required('Temperature is required')
    .min(-100, 'Temperature cannot be lower than -100°C')
    .max(200, 'Temperature cannot exceed 200°C'),

  voltage: Yup.number()
    .nullable()
    .typeError('Voltage must be a number or null')
    .min(0, 'Voltage cannot be negative')
    .max(1000, 'Voltage cannot exceed 1000'),

  current: Yup.number()
    .nullable()
    .typeError('Current must be a number or null')
    .min(0, 'Current cannot be negative')
    .max(1000, 'Current cannot exceed 1000'),

  temperatureThreshold: Yup.number()
    .required('Temperature threshold is required')
    .min(-100, 'Temperature threshold cannot be lower than -100°C')
    .max(200, 'Temperature threshold cannot exceed 200°C'),

  power: Yup.object({
    realPower: Yup.number().required('Real Power is required').min(0, 'Real Power cannot be negative'),
  })
    .required('Power object is required')
    .nullable(),
  temperatureThreshold: Yup.number().optional(),
  relayState: Yup.boolean().required('Relay state is required').typeError('Relay state must be a boolean'),
});
