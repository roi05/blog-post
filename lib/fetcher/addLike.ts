import axios from 'axios';

export const addLike = async (postId: string) => {
  const response = await axios.post(`/api/like/${postId}`);
  return response.data;
};
