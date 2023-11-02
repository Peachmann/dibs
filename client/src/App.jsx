import { useEffect, useState } from 'react';
import Item from './components/Item';
import Navbar from './components/Navbar';
import * as itemService from './services/itemService';

function App() {
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
    <div className="App">
      <Navbar></Navbar>
      <div className="grid">
        {items.map((item) => (
          <Item key={item.ID} item={item} />
        ))}
      </div>
    </div>
  );
}

export default App;
