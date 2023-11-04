import '../styles.css';

function Item({ item }) {
  return (
    <div className="card">
      <img src={item.Picture} alt={item.Title} className="image" />
      <h3 className="title">{item.Title}</h3>
      <p className="description">{item.Description}</p>
      <div className="footer">
        <div>
          <p className="price">${item.Price.toFixed(2)}</p>
        </div>
        <button className="button">Dibs</button>
      </div>
    </div>
  );
}

export default Item;
