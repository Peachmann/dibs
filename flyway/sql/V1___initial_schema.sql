CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	display_name VARCHAR (50) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	telegram_id BIGINT NOT NULL UNIQUE
);

CREATE TABLE item_listings (
	item_id SERIAL PRIMARY KEY,
	seller_id INTEGER NOT NULL REFERENCES users(user_id),
	title VARCHAR (50) NOT NULL,
	description VARCHAR (500),
	price NUMERIC NOT NULL,
	picture VARCHAR (256),
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP,
	sold_at TIMESTAMP,
	pickup_point VARCHAR (256)
);

CREATE TABLE dibs (
	dibs_id SERIAL PRIMARY KEY,
	item_id INTEGER NOT NULL REFERENCES item_listings(item_id),
	buyer_id INTEGER NOT NULL REFERENCES users(user_id),
	dibsed_at TIMESTAMP,
	active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO users (display_name, telegram_id) VALUES ('admin', 12321);
INSERT INTO users (display_name, telegram_id) VALUES ('another user', 44444);