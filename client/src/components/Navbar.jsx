import axios from 'axios';
import { useEffect } from 'react';

function Navbar() {

  const loginWithTelegram = () => {
    const url = "http://localhost:8080/api/hello"
    axios.get(url)
      .then((response) => {
        console.log(response);
      });
  }

  return (
    <div style={styles.navbar}>
      <h1 style={styles.title}>Dibs</h1>
      <input
        type="text"
        placeholder="Search..."
        //style={styles.searchInput}
        //onChange={(e) => setSearchTerm(e.target.value)}
      />
      <label style={styles.checkboxLabel}>
        <input
          type="checkbox"
          //onChange={(e) => setShowUndibsed(e.target.checked)}
        />
        Only show undibsed items
      </label>
      <label>Sort by:</label>
      <select
        style={styles.dropdown}
        //onChange={(e) => setFilter(e.target.value)}
      >
        <option value="price">Price</option>
      </select>
      <button
        style={styles.button}
        onClick={loginWithTelegram}
      >
        Login with Telegram
      </button>
    </div>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    borderBottom: '1px solid #ccc',
  },
  title: {
    fontSize: '24px',
    margin: '0',
  },
  searchInput: {
    fontSize: '16px',
    padding: '8px',
  },
  checkboxLabel: {
    fontSize: '16px',
    marginLeft: '10px',
  },
  dropdown: {
    fontSize: '16px',
    padding: '8px',
  },
  button: {
    fontSize: '16px',
    padding: '8px 16px',
    cursor: 'pointer',
  },
};

export default Navbar;
