/*
  # Create E-commerce Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `price` (numeric) - Product price
      - `category` (text) - Product category
      - `image_url` (text) - Product image URL
      - `stock` (integer) - Available stock
      - `rating` (numeric) - Average rating
      - `created_at` (timestamptz) - Creation timestamp
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Reference to auth.users
      - `total_amount` (numeric) - Order total
      - `status` (text) - Order status
      - `created_at` (timestamptz) - Creation timestamp
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid) - Reference to orders
      - `product_id` (uuid) - Reference to products
      - `quantity` (integer) - Quantity ordered
      - `price` (numeric) - Price at time of order
      - `created_at` (timestamptz) - Creation timestamp
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Reference to auth.users
      - `product_id` (uuid) - Reference to products
      - `quantity` (integer) - Quantity in cart
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Allow public read access to products
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  stock integer NOT NULL DEFAULT 0,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL DEFAULT 1,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

INSERT INTO products (name, description, price, category, image_url, stock, rating) VALUES
  ('Wireless Earbuds', 'Premium wireless earbuds with noise cancellation', 1299, 'Electronics', 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=400', 50, 4.5),
  ('Red Cotton T-Shirt', 'Comfortable cotton t-shirt for everyday wear', 499, 'Clothing', 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=400', 100, 4.2),
  ('Smart Watch', 'Fitness tracking smart watch with heart rate monitor', 2999, 'Electronics', 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400', 30, 4.7),
  ('Running Shoes', 'Lightweight running shoes for maximum comfort', 2499, 'Footwear', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400', 75, 4.4),
  ('Backpack', 'Durable laptop backpack with multiple compartments', 1799, 'Accessories', 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400', 60, 4.3),
  ('Coffee Maker', 'Automatic coffee maker with timer function', 3499, 'Home & Kitchen', 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400', 25, 4.6),
  ('Yoga Mat', 'Non-slip yoga mat with carrying strap', 899, 'Sports', 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400', 120, 4.1),
  ('Bluetooth Speaker', 'Portable waterproof bluetooth speaker', 1999, 'Electronics', 'https://images.pexels.com/photos/1279406/pexels-photo-1279406.jpeg?auto=compress&cs=tinysrgb&w=400', 45, 4.5),
  ('Blue Denim Jeans', 'Classic fit denim jeans', 1499, 'Clothing', 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400', 80, 4.3),
  ('LED Desk Lamp', 'Adjustable LED desk lamp with USB charging port', 1299, 'Home & Kitchen', 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400', 55, 4.4);
