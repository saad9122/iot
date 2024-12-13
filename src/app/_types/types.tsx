import {
  changePasswordFormSchema,
  customerFormSchema,
  usersFormSchema,
} from '@/util/validationSchema';
import { ColumnDef } from '@tanstack/react-table';
import * as Yup from 'yup';

export type ExtendedColumnDef<T> = ColumnDef<T> & {
  className?: string;
};

export type CustomerFormValues = Yup.InferType<typeof customerFormSchema>;

export type UserFormValues = Yup.InferType<typeof usersFormSchema>;

export type ChangePasswordFormValues = Yup.InferType<typeof changePasswordFormSchema>;
