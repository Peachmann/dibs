import api from '../utils/api';

const BASE_URL = import.meta.env.VITE_API_URL;

export const getItems = async () => {
  try {
    console.log(`${BASE_URL}/api/items`);
    const response = await api.get(`${BASE_URL}/api/items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items', error);
    throw error;
  }
};

export const createItem = async (itemData) => {
  try {
    const response = await api.post(`${BASE_URL}/items`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating item', error);
    throw error;
  }
};
