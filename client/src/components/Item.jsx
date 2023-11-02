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
          <p className="pickup-point">{item.PickupPoint}</p>
        </div>
        <button className="button">Dibs</button>
      </div>
      <div className="seller-info">
        <p>Sold by: {item.Seller.DisplayName || 'Unknown'}</p>
        <p>Contact: {item.Seller.TelegramID || 'N/A'}</p>
      </div>
    </div>
  );
}

export default Item;
