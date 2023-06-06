'use client';

import { FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-3xl font-bold mb-6'>Login</h2>
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className='flex items-center justify-center px-4 py-2 text-white bg-red-500 rounded-md shadow hover:bg-red-600 focus:outline-none focus:bg-red-600'>
          <FaGoogle className='w-6 h-6 mr-2' />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
