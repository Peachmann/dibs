function Navbar() {
  const loginWithTelegram = () => {
    console.log('hello');
  };

  return (
    <div className="navbar">
      <h1 className="title">Dibs</h1>
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        // onChange={(e) => setSearchTerm(e.target.value)}
      />
      <label className="checkbox-label">
        <input
          type="checkbox"
          // onChange={(e) => setShowUndibsed(e.target.checked)}
        />
        Only show undibsed items
      </label>
      <label>Sort by:</label>
      <select
        className="dropdown"
        // onChange={(e) => setFilter(e.target.value)}
      >
        <option value="price">Price</option>
      </select>
      <button className="button" onClick={loginWithTelegram}>
        Login with Telegram
      </button>
    </div>
  );
}

export default Navbar;
