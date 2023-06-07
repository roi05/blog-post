import PostList from './PostList';
import { dehydrate, Hydrate } from '@tanstack/react-query';
import getQueryClient from '../../../lib/getQueryClient';
import axios from 'axios';

export const getPosts = async () => {
  const response = await axios.get('/api/post');
  return response.data;
};

export default async function Post() {
  const queryClient = getQueryClient();
  const data = await queryClient.prefetchQuery(['posts'], getPosts);
  const dehydratedState = dehydrate(queryClient);

  console.log(data);
  return (
    <Hydrate state={dehydratedState}>
      <PostList />
    </Hydrate>
  );
}
