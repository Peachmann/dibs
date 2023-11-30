CREATE TABLE item_listings (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    seller_username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    pictures JSONB,
    not_sold BOOLEAN DEFAULT TRUE,
    pickup_point VARCHAR(256),
    is_dibsed BOOLEAN DEFAULT FALSE
);

CREATE TABLE dibs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    item_listing_id INTEGER NOT NULL REFERENCES item_listings(id),
    buyer_username VARCHAR(255)
);

INSERT INTO item_listings (seller_username, title, description, price, pictures, pickup_point) VALUES
('seller1', 'Bicycle', 'A gently used mountain bike, great for off-road trails.', 150.00, '["./src/assets/item.png"]', '123 Main St, Hometown'),
('seller1', 'Laptop', '2019 MacBook Pro, 15-inch, 16GB RAM, 512GB SSD', 1200.00, '["./src/assets/item.png"]', '456 Oak St, Techville'),
('seller2', 'Guitar', 'Fender Stratocaster electric guitar, excellent condition.', 700.00, '["./src/assets/item.png"]', '789 Pine St, Music City'),
('seller2', 'Desk Chair', 'Ergonomic office chair, adjustable and very comfortable.', 100.00, '["./src/assets/item.png"]', '321 Elm St, Worktown'),
('seller1', 'Camping Tent', '4-person dome tent, includes all stakes and poles.', 50.00, '["./src/assets/item.png"]', '159 River Rd, Adventureland'),
('seller2', 'Coffee Maker', 'Keurig K-Elite single serve coffee maker, barely used.', 75.00, '["./src/assets/item.png"]', '753 Maple St, Coffeetown');
