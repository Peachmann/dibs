import '../styles.css';

function Item({ item }) {
  return (
    <div className="card">
      <img src={item.picture} alt={item.title} className="image" />
      <h3 className="title">{item.title}</h3>
      <p className="description">{item.description}</p>
      <div className="footer">
        <div>
          <p className="price">${item.price.toFixed(2)}</p>
        </div>
        <button className="button">Dibs</button>
      </div>
    </div>
  );
}

export default Item;
