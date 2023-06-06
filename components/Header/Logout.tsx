'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function Logout() {
  return (
    <Button
      variant='ghost'
      onClick={() => signOut({ callbackUrl: '/' })}>
      Logout
    </Button>
  );
}
