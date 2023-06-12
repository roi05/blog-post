'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllUserPost } from '@/lib/fetcher/getAllUserPost';
import { useSession } from 'next-auth/react';
import { UserPostTypes, PostTypes } from '@/types/User-Post';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { FaTrash } from 'react-icons/fa';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';

const UserPostList = ({ post }: { post: PostTypes }) => {
  const {
    author: { image, name },
    body,
    likes,
    id,
  } = post;

  const [isEditing, setIsEditing] = useState(false);
  const [postBody, setPostBody] = useState<string>(body);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Save the updated post body or perform any other actions
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    // Reset the post body to the original value
    setPostBody(body);
    setIsEditing(false);
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPostBody(event.target.value);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const length = postBody.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(length, length);
    }

    return () => {
      if (textareaRef.current) {
        textareaRef.current.blur(); // Remove focus
      }
    };
  }, [isEditing, postBody]);

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
        <button className='ml-auto px-3'>
          <FaTrash className='text-red-500 text-lg' />
        </button>
      </div>
      {!isEditing ? (
        <p className='text-gray-800 py-5'>{postBody}</p>
      ) : (
        <textarea
          className='text-gray-800 py-3 px-2 w-full'
          ref={textareaRef}
          value={postBody}
          onChange={handleInputChange}
        />
      )}
      {isEditing && (
        <div className='flex justify-end'>
          <button
            className='px-3'
            onClick={handleSaveClick}>
            Save
          </button>
          <button
            className='px-3'
            onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      )}

      {!isEditing && (
        <Button
          onClick={handleEditClick}
          type='submit'
          variant='secondary'
          className='w-full my-2'
          // disabled={isLoading}
        >
          {/* {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} */}
          Update
        </Button>
      )}
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
