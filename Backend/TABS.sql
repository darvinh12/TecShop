CREATE TABLE store.User (
	user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE store.Category (
	category_id SERIAL PRIMARY KEY,
	category_name VARCHAR(50) UNIQUE NOT NULL,
	description TEXT
);


CREATE TABLE store.Product (
	product_id SERIAL PRIMARY KEY,
	product_name VARCHAR(100) NOT NULL,
	description TEXT,
	price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
	stock INTEGER NOT NULL CHECK (stock >= 0),
	category_id INTEGER NOT NULL,
	CONSTRAINT catergory_product_FK FOREIGN KEY (category_id) REFERENCES store.Category(category_id) ON DELETE CASCADE
);


CREATE TABLE store.Order (
	order_id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	status VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Enviado', 'Entregado', 'Cancelado')),
	CONSTRAINT user_order_FK FOREIGN KEY (user_id) REFERENCES store.User(user_id) ON DELETE CASCADE
);


CREATE TABLE store.Order_Item (
	order_item_id SERIAL PRIMARY KEY,
	order_id INTEGER NOT NULL,
	product_id INTEGER NOT NULL,
	quantity INTEGER NOT NULL,
	price NUMERIC(10,2),
	CONSTRAINT order_item_FK FOREIGN KEY (order_id) REFERENCES store.Order(order_id) ON DELETE CASCADE,
	CONSTRAINT product_order_item_FK FOREIGN KEY (product_id) REFERENCES store.Product(product_id)
);

CREATE TABLE store.Payment (
    payment_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Aprobado' CHECK (status IN ('Aprobado', 'Rechazado')),
    CONSTRAINT order_payment FOREIGN KEY (order_id) REFERENCES store.Order(order_id) ON DELETE CASCADE
);