import { getAllUserPost } from '@/lib/fetcher/getAllUserPost';
import UserPost from '@/components/User-Feed/UserPost';
import { dehydrate, Hydrate } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import getQueryClient from '@/lib/getQueryClient';

export default async function page() {
  const session = await getServerSession(authOptions);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    ['getAllUserPost', session?.user?.email],
    getAllUserPost
  );
  const dehydratedState = dehydrate(queryClient);

  if (!session) {
    redirect('/');
  }

  return (
    <div className='px-4 sm:container mx-auto md:px-44'>
      <Hydrate state={dehydratedState}>
        <UserPost />
      </Hydrate>
    </div>
  );
}
