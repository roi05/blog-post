import axios from 'axios';

export const getAllUserPost = async () => {
  const response = await axios.get('/api/user');
  return response.data;
};
