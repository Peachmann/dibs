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

export const dibsItem = async (itemID, user) => {
  user.auth_date = user.auth_date.toString();
  try {
    const response = await api.post(`${BASE_URL}/api/dibs/${itemID}`, {
      user: user
    });
    return response.data;
  } catch (error) {
    console.error('Error dibsing item', error);
    throw error;
  }
};

export const undibsItem = async (itemID, user) => {
  user.auth_date = user.auth_date.toString();
  try {
    const response = await api.delete(`${BASE_URL}/api/dibs/${itemID}`, {
      data: {
        user: user
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error undibsing item', error);
    throw error;
  }
};

export const getOwnDibs = async (itemID, user) => {
  user.auth_date = user.auth_date.toString();
  try {
    const response = await api.get(
      `${BASE_URL}/api/dibs/${itemID}/${user.username}`
    );
    return response.data.own_dibs;
  } catch (error) {
    console.error('Error undibsing item', error);
    throw error;
  }
};

export const createItem = async (itemData, user) => {
  try {
    const item_listing = {
      title: itemData.name,
      pickup_point: itemData.address,
      description: itemData.description,
      price: Number(itemData.price),
      not_sold: true,
      is_dibsed: false,
      seller_username: user.username
    };

    const form = new FormData();

    user.auth_date = user.auth_date.toString();
    form.append('item_listing', JSON.stringify(item_listing));
    form.append('user', JSON.stringify(user));

    for (let i = 1; i <= itemData.images.length; i++) {
      form.append('picture' + i, itemData.images[i - 1]);
    }

    await api.postForm(`${BASE_URL}/api/items`, form);
  } catch (error) {
    console.error('Error creating item', error);
    throw error;
  }
};
