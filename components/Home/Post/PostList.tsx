'use client';

import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from './Post';
import { Posttypes } from '../../../types/Post';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useSession, signIn } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addLike } from '@/lib/fetcher/addLike';

import { v4 as uuidv4 } from 'uuid';

type Props = {
  post: Posttypes;
};

const IndividualPost = ({ post }: Props) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [liked, setLiked] = useState(() => {
    return post.likes.some(like => like.user.email === session?.user?.email);
  });

  const {
    likes,
    body,
    id,
    author: { image, name },
  } = post;

  const { mutate } = useMutation(addLike, {
    onMutate: async postId => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      queryClient.setQueryData(['posts'], (old: any) => {
        const updatedPosts = old.map((post: any) => {
          if (post.id === postId) {
            const userLikeIndex = post.likes.findIndex(
              (like: any) => like.user.email === session?.user?.email
            );
            if (userLikeIndex !== -1) {
              const updatedLikes = [...post.likes];
              updatedLikes.splice(userLikeIndex, 1);
              return { ...post, likes: updatedLikes };
            } else {
              const newLike = {
                id: uuidv4(),
                postId: postId,
                userId: uuidv4(),
                post: {},
                user: {
                  id: uuidv4(),
                  name: session?.user?.name,
                  email: session?.user?.email,
                  emailVerified: null,
                  image: session?.user?.image,
                },
              };
              const updatedLikes = [...post.likes, newLike];
              return { ...post, likes: updatedLikes };
            }
          }
          return post;
        });

        return updatedPosts;
      });

      return { previousPosts };
    },

    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['posts'], context?.previousPosts);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleLike = (id: string) => {
    if (!session) {
      return signIn();
    }

    mutate(id);
    setLiked(prev => !prev);
  };

  return (
    <div className='bg-white rounded-lg shadow p-4 mb-4'>
      <div className='flex items-center mb-2'>
        <div className='flex items-center mr-2'>
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>
              {name.charAt(0).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className='ml-2 font-bold'>{name}</span>
        </div>
        <span className='text-gray-500'>{likes?.length} Likes</span>
      </div>
      <p className='text-gray-800'>{body}</p>
      <Separator className='my-4' />
      <button
        className={`flex items-center text-gray-600 ${
          liked ? 'text-red-500' : ''
        }`}
        onClick={() => handleLike(id)}>
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
            post={post}
          />
        ))}
    </div>
  );
};

export default PostList;
