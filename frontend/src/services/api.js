import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const fetchFeatures = async (params) => {
  try {
    const response = await api.get('/features', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching features:', error);
    throw error;
  }
};

export const createComment = async (data) => {
  try {
    const response = await api.post('/features', data);
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export default api;