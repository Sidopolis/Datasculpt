/*
  # DataSculpt Database Schema

  1. New Tables
    - `users` - User authentication and profile data
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `created_at` (timestamp)
    
    - `products` - Product catalog
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (decimal)
      - `category` (text)
      - `created_at` (timestamp)
    
    - `orders` - Order transactions
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `quantity` (integer)
      - `state` (text)
      - `total_amount` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated user access
    - Insert sample data for demo purposes

  3. Sample Data
    - Products across different categories
    - Orders distributed across Indian states
    - Revenue data for analytics
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10,2) NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by authenticated users"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  state text NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample products
INSERT INTO products (name, price, category) VALUES
  ('Wireless Headphones', 2999.00, 'Electronics'),
  ('Smart Watch', 15999.00, 'Electronics'),
  ('Bluetooth Speaker', 1799.00, 'Electronics'),
  ('Fitness Tracker', 4999.00, 'Electronics'),
  ('Smartphone Case', 599.00, 'Accessories'),
  ('Power Bank', 1299.00, 'Electronics'),
  ('Gaming Mouse', 2499.00, 'Electronics'),
  ('Laptop Stand', 899.00, 'Accessories'),
  ('Wireless Charger', 1899.00, 'Electronics'),
  ('USB Cable', 299.00, 'Accessories');

-- Insert sample orders with realistic data distribution
INSERT INTO orders (product_id, user_id, quantity, state, total_amount, created_at)
SELECT 
  p.id,
  gen_random_uuid(),
  floor(random() * 5 + 1)::integer,
  (ARRAY['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Telangana', 'Kerala'])[floor(random() * 10 + 1)],
  p.price * floor(random() * 5 + 1),
  now() - (random() * interval '90 days')
FROM products p
CROSS JOIN generate_series(1, 50);