CREATE DATABASE IF NOT EXISTS ai_sql_generator;
USE ai_sql_generator;

-- Query history table
CREATE TABLE IF NOT EXISTS query_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  english_text TEXT NOT NULL,
  sql_query TEXT NOT NULL,
  row_count INT DEFAULT 0,
  status ENUM('success', 'error') DEFAULT 'success',
  error_message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample ecommerce tables for demo
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200),
  category VARCHAR(100),
  price DECIMAL(10,2),
  stock INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10,2),
  status ENUM('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Sample data
INSERT INTO users (name, email, city) VALUES
('Naveen Kumar', 'naveen@email.com', 'Bengaluru'),
('Rahul Sharma', 'rahul@email.com', 'Mumbai'),
('Priya Singh', 'priya@email.com', 'Delhi'),
('Amit Patel', 'amit@email.com', 'Ahmedabad'),
('Sneha Reddy', 'sneha@email.com', 'Hyderabad');

INSERT INTO products (name, category, price, stock) VALUES
('iPhone 15', 'Electronics', 79999, 50),
('Samsung TV 55inch', 'Electronics', 45999, 20),
('Nike Running Shoes', 'Footwear', 8999, 100),
('Levi Jeans', 'Clothing', 3499, 200),
('Sony Headphones', 'Electronics', 12999, 75);

INSERT INTO orders (user_id, total_amount, status, created_at) VALUES
(1, 79999, 'delivered', '2026-01-05'),
(2, 45999, 'shipped', '2026-01-10'),
(3, 8999, 'confirmed', '2026-01-15'),
(4, 3499, 'pending', '2026-02-01'),
(5, 12999, 'delivered', '2026-02-10'),
(1, 3499, 'cancelled', '2026-03-01'),
(2, 8999, 'delivered', '2026-03-05');

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 79999),
(2, 2, 1, 45999),
(3, 3, 1, 8999),
(4, 4, 1, 3499),
(5, 5, 1, 12999),
(6, 4, 1, 3499),
(7, 3, 1, 8999);
