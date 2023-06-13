'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';

const createPost = async (postData: string) => {
  const response = await axios.post('/api/post', { body: postData });
  return response.data;
};

export default function SubmitPost() {
  const [textareaValue, setTextareaValue] = useState('');
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const { mutate, isLoading } = useMutation(createPost, {
    onMutate: async newPost => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);
      const optimisticPost = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        body: newPost,
        authorId: uuidv4(),
        author: {
          id: uuidv4(),
          name: session?.user?.name,
          email: session?.user?.email,
          emailVerified: null,
          image: session?.user?.image,
        },
        likes: [],
      };
      queryClient.setQueryData(['posts'], (old: any) => [
        optimisticPost,
        ...old,
      ]);
      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      queryClient.setQueryData(['posts'], context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(textareaValue);
    setTextareaValue('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='mb-5'>
      <div className='grid w-full gap-2'>
        <Textarea
          placeholder="What's on your mind?"
          value={textareaValue}
          onChange={e => setTextareaValue(e.target.value)}
        />
        <Button
          type='submit'
          disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Post
        </Button>
      </div>
    </form>
  );
}
