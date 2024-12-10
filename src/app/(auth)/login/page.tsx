import Loginform from '@/app/_components/forms/loginform';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import React from 'react';

const Login: React.FC = async () => {
  const session = await getServerSession(options);

  // if (session) {
  //   return {+
  //     redirect: {
  //       destination: '/',
  //       permanent: false,
  //     },
  //   }
  // }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-sm text-gray-500">Sign in to continue</p>
          </div>
          <Loginform />
        </div>
      </div>
    </div>
  );
};
export default Login;
