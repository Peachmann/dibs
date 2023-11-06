import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import * as itemService from '../services/itemService';
import Item from '../components/Item';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/AuthService';

export const Home = () => {
  const navigate = useNavigate();
  if (!isAuthenticated()) {
    navigate('/login');
  }

  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await itemService.getItems();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch items', error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <>
      <Layout>
        <div className="grid">
          {items.map((item) => (
            <Item key={item.ID} item={item} />
          ))}
        </div>
      </Layout>
    </>
  );
};

export default Home;
