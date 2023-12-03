import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import * as itemService from '../services/itemService';
import { DibsItem } from '../components/AvailableItem';
import Masonry from '@mui/lab/Masonry';
import { SellButton } from '../components/SellButton';

import { Box } from '@mui/material';

const MainLayout = () => {
  const [items, setItems] = useState([]);
  const [change, setChange] = useState(false);
  const heights = [325, 450, 250];

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
  }, [change]);

  if (items[0] === undefined) return null;

  return (
    <>
      <Masonry columns={3} spacing={5} sx={{ width: '66%', paddingTop: '1%' }}>
        {items.map((item, index) => (
          <DibsItem key={index} item={item} hg={heights[index % 3]} />
        ))}
      </Masonry>
      <SellButton change={change} setChange={setChange} />
    </>
  );
};

export const Home = () => {
  return (
    <>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <MainLayout />
        </Box>
      </Layout>
    </>
  );
};

export default Home;
