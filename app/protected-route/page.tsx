import { prisma } from '../../prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect('/');

  return <h1>this is protected routes</h1>;
}
