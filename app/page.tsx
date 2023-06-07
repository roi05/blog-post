import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import SubmitPost from '@/components/Home/SubmitPost';
import Post from '@/components/Home/Post/Post';

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className='px-4 sm:container mx-auto md:px-44'>
      {session && <SubmitPost />}
      {/* @ts-expect-error Server Component */}
      <Post />
    </div>
  );
}
