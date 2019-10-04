CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(20) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ('Destiny 2: Shadowkeep', 'Electronics', 39.99, 500),
		('Magic Grow Dinosaurs', 'Toys', 3.50, 627),
		('External Battery Pack', 'Electronics', 25.00, 300),
		('Shampoo', 'Toiletries', 4.25, 400),
		('Toliet Paper', 'Toiletries', 0.50, 800),
		('Water Shooter', 'Toys', 4.89, 300),
		('Bamazon Blecho', 'Smart Home', 29.99, 1000),
		('Bamazon Blecho Show', 'Smart Home', 69.99, 600),
		('Bamazon Blecho Dot', 'Smart Home', 49.99, 9000);