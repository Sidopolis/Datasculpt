# PostgreSQL Setup for DataSculpt

## Quick Setup

### 1. Install PostgreSQL
```bash
# Windows (using chocolatey)
choco install postgresql

# Or download from: https://www.postgresql.org/download/windows/
```

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE datasculpt;

# Create tables
\c datasculpt

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    total DECIMAL(10,2),
    created_at DATE
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10,2),
    category VARCHAR(50),
    stock INTEGER
);

-- Customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    state VARCHAR(50)
);

-- Insert sample data
INSERT INTO customers (name, email, state) VALUES
('John Doe', 'john@example.com', 'Kolkata'),
('Jane Smith', 'jane@example.com', 'Mumbai'),
('Bob Johnson', 'bob@example.com', 'Delhi');

INSERT INTO products (name, price, category, stock) VALUES
('LUX Innerwear Premium', 750.00, 'Innerwear', 50),
('LUX Comfort Vest', 800.00, 'Innerwear', 30),
('LUX Cotton Briefs', 300.00, 'Innerwear', 25);

INSERT INTO orders (customer_id, product_id, quantity, total, created_at) VALUES
(1, 1, 2, 1500.00, '2024-01-15'),
(2, 2, 1, 800.00, '2024-01-16'),
(3, 1, 3, 2250.00, '2024-01-17');
```

### 3. Environment Variables
Create a `.env` file in your project root:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=datasculpt
DB_USER=postgres
DB_PASSWORD=your_password
```

### 4. Install Node.js Dependencies
```bash
npm install pg @types/pg
```

### 5. Update Database Connection
Replace the mock database in `src/lib/database.ts` with real PostgreSQL connection:

```typescript
import { Client } from 'pg'

const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

export const connectDatabase = async () => {
  try {
    await client.connect()
    console.log('Connected to PostgreSQL')
    return client
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error
  }
}

export const executeSafeQuery = async (sql: string) => {
  const validation = mockQueries.validateQuery(sql)
  
  if (!validation.isValid) {
    throw new Error(validation.error)
  }
  
  try {
    const result = await client.query(sql)
    return result.rows
  } catch (error) {
    console.error('Query execution failed:', error)
    throw new Error('Database query failed')
  }
}
```

## Testing the Chat

Once PostgreSQL is set up, you can test the chat functionality:

1. Go to the Reports page
2. Ask questions like:
   - "Show revenue by state"
   - "List top LUX products by sales"
   - "Show customer orders"
   - "What's the total revenue?"
   - "Which state has highest sales?"

The AI will generate SQL queries and execute them against your PostgreSQL database!

## Sample Queries

Here are some example queries the AI might generate:

```sql
-- Revenue by state
SELECT c.state, SUM(o.total) as revenue 
FROM orders o 
JOIN customers c ON o.customer_id = c.id 
GROUP BY c.state 
ORDER BY revenue DESC;

-- Top products
SELECT p.name, COUNT(o.id) as sales, SUM(o.total) as revenue 
FROM orders o 
JOIN products p ON o.product_id = p.id 
GROUP BY p.id, p.name 
ORDER BY revenue DESC;

-- Customer analysis
SELECT c.name, COUNT(o.id) as orders, SUM(o.total) as total_spent 
FROM customers c 
LEFT JOIN orders o ON c.id = o.customer_id 
GROUP BY c.id, c.name 
ORDER BY total_spent DESC;
``` 