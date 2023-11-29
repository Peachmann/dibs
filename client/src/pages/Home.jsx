import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import * as itemService from '../services/itemService';
import { DibsItem } from '../components/AvailableItem';
import Masonry from '@mui/lab/Masonry';

import { Box } from '@mui/material';

const MainLayout = () => {
  const [items, setItems] = useState([]);
  const heights = [200, 350];

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

  if (items[0] === undefined) return null;

  return (
    <>
      <Masonry columns={3} spacing={5} sx={{ width: '66%', paddingTop: '1%' }}>
        <DibsItem hg={250} />
        <DibsItem hg={450} />
        <DibsItem hg={250} />
        <DibsItem hg={450} />
        <DibsItem hg={250} />
        <DibsItem hg={450} />
      </Masonry>
    </>
  );
};

export const Home = () => {
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

  if (items[0] === undefined) return null;

  return (
    <>
      <button onClick={itemService.createItem}>Send POST Request</button>
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <MainLayout />
        </Box>
      </Layout>
    </>
  );
};

export default Home;
