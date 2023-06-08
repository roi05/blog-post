'use client';
import { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from './Post';
import { Posttypes } from '../../../types/Post';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useSession, signIn } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  post: Posttypes;
};

const addLike = async (postId: string) => {
  try {
    const response = await axios.post(`/api/like/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to Like a post');
  }
};

const deleteLike = async (postId: string) => {
  try {
    const response = await axios.delete(`/api/like/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to Like a post');
  }
};

const IndividualPost = ({ post }: Props) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(() => {
    return post.likes.some(like => like.user.email === session?.user?.email);
  });
  const queryClient = useQueryClient();

  const {
    likes,
    body,
    id,
    author: { image, name },
  } = post;

  const { mutate: mutateAddLike } = useMutation(addLike, {
    onMutate: async postId => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      setLiked(true);
      queryClient.setQueryData(['posts'], (old: any) => {
        const updatedPosts = old.map((post: any) => {
          if (post.id === postId) {
            const updatedLikes = [
              ...post.likes,
              {
                id: uuidv4(),
                postId,
                userId: 'optimistic-user-id',
                post: [],
                user: {
                  id: 'optimistic-user-id',
                  name: '',
                  email: '',
                  emailVerified: null,
                  image: '',
                },
              },
            ];
            return { ...post, likes: updatedLikes };
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
      setLiked(true);
    },
  });

  const { mutate: mutateDeleteLike } = useMutation(deleteLike, {
    onMutate: async postId => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      setLiked(false);
      queryClient.setQueryData(['posts'], (old: any) => {
        const updatedPosts = old.map((post: any) => {
          if (post.id === postId) {
            const updatedLikes = post.likes.filter(
              (like: any) => like.user.email !== session?.user?.email
            );
            return { ...post, likes: updatedLikes };
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
      setLiked(false);
    },
  });

  const handleLike = (id: string) => {
    if (!session) {
      return signIn();
    }

    if (!liked) {
      mutateAddLike(id);
    }

    if (liked) {
      mutateDeleteLike(id);
    }
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
      {data && data.map(post => <IndividualPost post={post} />)}
    </div>
  );
};

export default PostList;
