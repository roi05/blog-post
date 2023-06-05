'use client';
import React from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function hi() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/random');
    },
  });

  if (status === 'loading') {
    return 'Loading or not authenticated...';
  }

  return 'User is logged in';
}
