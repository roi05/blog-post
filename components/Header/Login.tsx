'use client';
import { signIn } from 'next-auth/react';

import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Login() {
  return (
    <Button onClick={() => signIn()}>
      <Mail className='mr-2 h-4 w-4' /> Login with Email
    </Button>
  );
}
