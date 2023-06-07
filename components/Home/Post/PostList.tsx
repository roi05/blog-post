'use client';
import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from './Post';
import { Posttypes } from '../../../types/Post';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

type Props = {
  author: string;
  likes: string[];
  content: string;
  avatar: string;
};

const IndividualPost = ({ author, likes, content, avatar }: Props) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className='bg-white rounded-lg shadow p-4 mb-4'>
      <div className='flex items-center mb-2'>
        <div className='flex items-center mr-2'>
          <Avatar>
            <AvatarImage src={avatar} />
            <AvatarFallback>
              {author?.charAt(0).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='ml-2 font-bold'>{author}</span>
        </div>
        <span className='text-gray-500'>{likes?.length} Likes</span>
      </div>
      <p className='text-gray-800'>{content}</p>
      <Separator className='my-4' />
      <button
        className={`flex items-center text-gray-600 ${
          liked ? 'text-red-500' : ''
        }`}
        onClick={handleLike}>
        <FaHeart className='mr-1' />
        Like
      </button>
    </div>
  );
};

const PostList = () => {
  const { data } = useQuery<Posttypes[]>({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  return (
    <div className='container mx-auto px-4'>
      {data &&
        data.map(post => (
          <IndividualPost
            key={post.id}
            author={post.author.name}
            likes={post.likes}
            content={post.body}
            avatar={post.author.image}
          />
        ))}
    </div>
  );
};

export default PostList;
