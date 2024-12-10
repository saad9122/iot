'use client';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useTransition } from 'react';
import TextInput from '../inputs/TextInput';
import { Button } from '@/components/ui/button';
import { loginFormSchema } from '../../../util/validationSchema';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

const Loginform: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleSignInSubmit = async (
    values: Yup.InferType<typeof loginFormSchema>,
    { resetForm }: FormikHelpers<Yup.InferType<typeof loginFormSchema>>,
  ) => {
    startTransition(async () => {
      const res: any = await signIn('credentials', { ...values, redirect: false });

      if (!res.ok) {
        toast({
          variant: 'destructive',
          title: 'Error while logging in',
          description: 'Invalid Credentials',
        });

        console.error(`Invalid Credentials`);
        return;
      }

      toast({
        title: 'Signin successfull',
        description: 'Welcome to BankDash.',
      });

      resetForm();

      router.push('/');

      router.refresh();
    });
  };
  return (
    <div>
      <Formik
        initialValues={{
          userName: '',
          password: '',
        }}
        onSubmit={handleSignInSubmit}
        validationSchema={loginFormSchema}
      >
        <Form className="space-y-4 mt-10">
          <Field
            name="userName"
            as={TextInput}
            label="Username"
            type="text"
            imageSrc="/icons/mail.svg"
            placeholder="Enter your username"
          />
          <Field
            name="password"
            as={TextInput}
            label="Password"
            type="password"
            imageSrc="/icons/password.svg"
            placeholder="6+ Characters, 1 Capital letter"
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Signing in ...' : 'SignIn'}
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default Loginform;
