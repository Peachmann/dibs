import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import * as itemService from '../services/itemService';
import { AvailableItem } from '../components/Item';
import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/material';

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

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <>
      <Layout>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {items.map((item) => (
                <Grid xs={2} sm={4} md={4}>
                  <AvailableItem item={item}></AvailableItem>
                </Grid>
            ))}
          </Grid>
        </Box>
      </Layout>
    </>
  );
};

export default Home;
