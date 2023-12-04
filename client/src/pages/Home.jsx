import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import * as itemService from '../services/itemService';
import { DibsItem } from '../components/AvailableItem';
import Masonry from '@mui/lab/Masonry';
import { SellButton } from '../components/SellButton';
import CustomNavbar from '../components/Navbar';
import api from '../utils/api';
import { Buffer } from 'buffer';

import { Box } from '@mui/material';

const MainLayout = ({ change, setChange, items }) => {
  const heights = [325, 450, 250];

  return (
    <>
      <Masonry columns={3} spacing={5} sx={{ width: '66%', paddingTop: '1%' }}>
        {items.map((item, index) => (
          <DibsItem key={item.ID} item={item} hg={heights[index % 3]} />
        ))}
      </Masonry>
      <SellButton change={change} setChange={setChange} />
    </>
  );
};

export const Home = () => {
  const [items, setItems] = useState([]);
  const [change, setChange] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await itemService.getItems();

        for (let i = 0; i < data.length; i++) {
          const images = [];
          for (let j = 0; j < data[i].Pictures.length; j++) {
            const img = await api
              .get(data[i].Pictures[j], {
                responseType: 'arraybuffer'
              })
              .then((res) =>
                Buffer.from(res.data, 'binary').toString('base64')
              );
            images.push('data:image/png;base64, ' + img);
          }

          data[i].Pictures = images;
        }

        setItems(data);
        setFilteredItems(data);
        console.log('Fetched items');
      } catch (error) {
        console.error('Failed to fetch items', error);
      }
    };

    fetchItems();
  }, [change]);

  if (items[0] === undefined) return null;

  return (
    <>
      <Layout>
        <CustomNavbar
          items={[items, setItems]}
          filteredItems={[filteredItems, setFilteredItems]}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <MainLayout
            items={filteredItems}
            change={change}
            setChange={setChange}
          />
        </Box>
      </Layout>
    </>
  );
};

export default Home;
