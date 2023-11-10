CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    display_name VARCHAR(50) NOT NULL UNIQUE,
    telegram_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE item_listings (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    seller_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    price NUMERIC NOT NULL,
    picture VARCHAR(256),
    sold_at TIMESTAMP,
    pickup_point VARCHAR(256),
    is_dibsed BOOLEAN DEFAULT FALSE
);

CREATE TABLE dibs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    item_id INTEGER NOT NULL REFERENCES item_listings(id),
    buyer_id INTEGER NOT NULL REFERENCES users(id),
    dibsed_at TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO users (display_name, telegram_id) VALUES
('admin', 'admin'),
('another user', '44444');

INSERT INTO item_listings (seller_id, title, description, price, picture, pickup_point) VALUES
(1, 'Bicycle', 'A gently used mountain bike, great for off-road trails.', 150.00, './src/assets/item.png', '123 Main St, Hometown'),
(1, 'Laptop', '2019 MacBook Pro, 15-inch, 16GB RAM, 512GB SSD', 1200.00, './src/assets/item.png', '456 Oak St, Techville'),
(2, 'Guitar', 'Fender Stratocaster electric guitar, excellent condition.', 700.00, './src/assets/item.png', '789 Pine St, Music City'),
(2, 'Desk Chair', 'Ergonomic office chair, adjustable and very comfortable.', 100.00, './src/assets/item.png', '321 Elm St, Worktown'),
(1, 'Camping Tent', '4-person dome tent, includes all stakes and poles.', 50.00, './src/assets/item.png', '159 River Rd, Adventureland'),
(2, 'Coffee Maker', 'Keurig K-Elite single serve coffee maker, barely used.', 75.00, './src/assets/item.png', '753 Maple St, Coffeetown');