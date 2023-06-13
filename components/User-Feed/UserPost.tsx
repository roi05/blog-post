'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUserPost } from '@/lib/fetcher/getAllUserPost';
import { useSession } from 'next-auth/react';
import { UserPostTypes, PostTypes } from '@/types/User-Post';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import axios from 'axios';
import { EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

const updateUserPost = async (data: { id: string; body: string }) => {
  const { id, body } = data;
  return await axios.patch(`api/user/${id}`, { postBody: body });
};

const deleteUserPost = async (id: string) => {
  return await axios.delete(`api/user/${id}`);
};

const UserPostList = ({ post }: { post: PostTypes }) => {
  const {
    author: { image, name },
    body,
    likes,
    id,
  } = post;

  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [postBody, setPostbody] = useState(body);

  const { mutate: mutateUpdate } = useMutation(updateUserPost, {
    onMutate: async newTodo => {
      // Snapshot the previous value
      const previousUserPost = queryClient.getQueryData([
        'getAllUserPost',
        session?.user?.email,
      ]);

      // Return a context object with the snapshotted value
      return { previousUserPost };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        ['getAllUserPost', session?.user?.email],
        context?.previousUserPost
      );
    },
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries(['getAllUserPost', session?.user?.email]),
        queryClient.invalidateQueries(['posts']),
      ]);
    },
  });

  const { mutate: mutateDelete } = useMutation(deleteUserPost, {
    onMutate: async id => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ['getAllUserPost', session?.user?.email],
      });

      // Snapshot the previous value
      const previousUserPost = queryClient.getQueryData([
        'getAllUserPost',
        session?.user?.email,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ['getAllUserPost', session?.user?.email],
        (old: any) => ({
          ...old,
          posts: old.posts.filter((post: any) => post.id !== id),
        })
      );

      // Return a context object with the snapshotted value
      return { previousUserPost };
    },

    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        ['getAllUserPost', session?.user?.email],
        context?.previousUserPost
      );
    },
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries(['getAllUserPost', session?.user?.email]),
        queryClient.invalidateQueries(['posts']),
      ]);
    },
  });

  const handleOnSave = async () => {
    mutateUpdate({ id, body: postBody });
  };

  const handleDelete = async (id: string) => {
    mutateDelete(id);
  };

  return (
    <div className='bg-white rounded-lg shadow p-4 mb-4'>
      <div className='flex items-center mb-5'>
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
        <button
          className='ml-auto p-3'
          onClick={() => handleDelete(id)}>
          <FaTrash className='text-red-500 text-xl' />
        </button>
      </div>
      <div>
        <EditTextarea
          inputClassName='p-10 overflow-hidden break-words'
          rows={5}
          value={postBody}
          onSave={handleOnSave}
          onChange={e => setPostbody(e.target.value)}
        />
      </div>
    </div>
  );
};

export default function UserPost() {
  const { data: session } = useSession();

  const { data } = useQuery<UserPostTypes>(
    ['getAllUserPost', session?.user?.email],
    getAllUserPost
  );

  return (
    <div className='container mx-auto px-4'>
      {data &&
        data.posts?.map(post => (
          <UserPostList
            key={post.id}
            post={post}
          />
        ))}
    </div>
  );
}
