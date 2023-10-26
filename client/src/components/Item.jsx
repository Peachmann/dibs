function Item({ item }) {
  return (
    <div style={styles.card}>
      <img src={item.picture} alt={item.title} style={styles.image} />
      <h3 style={styles.title}>{item.title}</h3>
      <div style={styles.footer}>
        <p style={styles.price}>${item.price.toFixed(2)}</p>
        <button style={styles.button}>Dibs</button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '16px',
    margin: '16px',
    textAlign: 'center',
    width: '200px',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    marginBottom: '8px',
    borderRadius: '4px',
  },
  title: {
    fontSize: '18px',
    margin: '8px 0',
  },
  price: {
    fontSize: '16px',
    color: '#333',
    margin: '0',
    marginRight: '8px',
  },
  button: {
    fontSize: '16px',
    padding: '8px 16px',
    cursor: 'pointer',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Item;
