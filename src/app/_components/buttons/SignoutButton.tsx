'use client';
import React from 'react';
import { signOut } from 'next-auth/react';

const SignoutButton: React.FC = () => {
  return <button onClick={() => signOut()}>Signout</button>;
};

export default SignoutButton;
