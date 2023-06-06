import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { IoMdArrowDropdown } from 'react-icons/io';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';
import Login from './Login';
import Logout from './Logout';
import Link from 'next/link';

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <div className='flex items-center justify-between h-16 px-4 sm:px-24 bg-white border-b border-gray-200 mb-4'>
      <Link href='/'>
        <h1 className='text-4xl font-bold text-gray-800  tracking-wide'>
          <span className='text-blue-500'>Post</span> It
        </h1>
      </Link>
      {session ? (
        <div className='flex items-center h-16 px-4'>
          <Avatar>
            <AvatarImage src={session?.user?.image ?? ''} />
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <IoMdArrowDropdown className='text-2xl cursor-pointer' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Logout />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}
