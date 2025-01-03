import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 1000,
});

export const fetchUserData = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};
