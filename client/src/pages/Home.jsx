import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import * as itemService from '../services/itemService';
import { DibsItem } from '../components/AvailableItem';
import Grid from '@mui/material/Grid';

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

  if (items[0] === undefined) return null;

  return (
    <>
      <button onClick={itemService.createItem}>Send POST Request</button>
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Grid
            container
            direction="row"
            spacing={2}
            sx={{ marginTop: '1%', maxWidth: '66%' }}
          >
            <Grid item container direction="column" xs spacing={1}>
              <Grid item xs>
                <DibsItem minHg={200}></DibsItem>
              </Grid>
              <Grid item xs>
                <DibsItem minHg={350}></DibsItem>
              </Grid>
            </Grid>
            <Grid item container direction="column" xs spacing={1}>
              <Grid item xs>
                <DibsItem minHg={350}></DibsItem>
              </Grid>
              <Grid item xs>
                <DibsItem minHg={200}></DibsItem>
              </Grid>
            </Grid>
            <Grid item container direction="column" xs spacing={1}>
              <Grid item xs>
                <DibsItem minHg={200}></DibsItem>
              </Grid>
              <Grid item xs>
                <DibsItem minHg={350}></DibsItem>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Layout>
    </>
  );
};

export default Home;
