import { useState } from 'react';
import db from '../tempdb.json';
import Item from './components/Item';
import Navbar from './components/Navbar';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [items, setItems] = useState(db);

  return (
    <div className="App">
      <Navbar></Navbar>
      <div style={styles.grid}>
        {items.map((item) => (
          <Item key={item.item_id} item={item} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
};

export default App;
