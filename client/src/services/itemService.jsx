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
    const response = await api.post(
      `${BASE_URL}/api/items`,
      {
        seller_username: 'Reinmar',
        title: 'book',
        description: 'Black magic II.',
        price: 45.0,
        picture: 'images/magic.jpg',
        pickup_point: 'Sleesia',
        not_sold: true,
        is_dibsed: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Id': '10001',
          'First-Name': 'Reynevan',
          'Last-Name': 'von Bielau',
          Username: 'Reinmar',
          'Photo-Url': 'images/reinmar.jpg',
          'Auth-Date': '12345123',
          'Auth-Hash': '*',
        },
      },
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error('Error creating item', error);
    throw error;
  }
};
