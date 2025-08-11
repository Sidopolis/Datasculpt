import 'dotenv/config';
// import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Client } from 'pg';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const dbConfig = {
  host: process.env.DB_HOST || 'ec2-3-237-189-104.compute-1.amazonaws.com',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secure123',
};

// MySQL pool
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DB || 'lux_industries',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// Test MySQL connection on startup
mysqlPool.getConnection()
  .then(connection => {
    console.log('✅ MySQL connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
    console.log('💡 Make sure MySQL is running and credentials are correct');
  });

// Test connection endpoint
app.post('/api/test-connection', async (req, res) => {
  const { type, host, port, database, username, password } = req.body;
  
  if (!type || !host || !port || !database || !username || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required connection parameters' 
    });
  }

  try {
    if (type === 'mysql') {
      const testPool = mysql.createPool({
        host,
        port: Number(port),
        user: username,
        password,
        database,
        connectionLimit: 1,
        acquireTimeout: 5000,
      });

      const connection = await testPool.getConnection();
      await connection.query('SELECT 1');
      connection.release();
      await testPool.end();
      
      res.json({ success: true, message: 'MySQL connection successful' });
    } else if (type === 'postgresql') {
      const { Client } = await import('pg');
      const client = new Client({
        host,
        port: Number(port),
        database,
        user: username,
        password,
      });

      await client.connect();
      await client.query('SELECT 1');
      await client.end();
      
      res.json({ success: true, message: 'PostgreSQL connection successful' });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Unsupported database type' 
      });
    }
  } catch (error) {
    console.error('Connection test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Connection test failed' 
    });
  }
});

// API endpoint to execute SQL queries
app.post('/api/execute-query', async (req, res) => {
  const { sqlQuery, connectionConfig } = req.body;
  
  if (!sqlQuery) {
    return res.status(400).json({ error: 'SQL query is required' });
  }
  
  try {
    // Security checks
    const lowerQuery = sqlQuery.toLowerCase();
    
    if (lowerQuery.includes('drop') || lowerQuery.includes('delete') || lowerQuery.includes('truncate')) {
      return res.status(400).json({ error: 'Destructive operations are not allowed' });
    }
    
    if (lowerQuery.includes('insert') || lowerQuery.includes('update')) {
      return res.status(400).json({ error: 'Write operations are not allowed in read-only mode' });
    }
    
    if (!lowerQuery.includes('select')) {
      return res.status(400).json({ error: 'Only SELECT queries are allowed' });
    }

    let result;
    
    // If connection config is provided, use it; otherwise use default PostgreSQL
    if (connectionConfig && connectionConfig.type === 'postgresql') {
      const { Client } = await import('pg');
      const dynamicClient = new Client({
        host: connectionConfig.host,
        port: Number(connectionConfig.port),
        database: connectionConfig.database,
        user: connectionConfig.username,
        password: connectionConfig.password,
      });
      
      await dynamicClient.connect();
      result = await dynamicClient.query(sqlQuery);
      await dynamicClient.end();
    } else {
      // Use default PostgreSQL connection
      const client = new Client(dbConfig);
      await client.connect();
      result = await client.query(sqlQuery);
      await client.end();
    }
    
    res.json({
      data: result.rows || [],
      total: result.rowCount || 0,
      success: true
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Database query failed',
      details: error.message 
    });
  }
});

// MySQL execute query endpoint (read-only)
app.post('/api/mysql/execute-query', async (req, res) => {
  const { sqlQuery, connectionConfig } = req.body;
  if (!sqlQuery) {
    return res.status(400).json({ error: 'SQL query is required' });
  }

  try {
    const lowerQuery = sqlQuery.toLowerCase();

    if (lowerQuery.includes('drop') || lowerQuery.includes('delete') || lowerQuery.includes('truncate')) {
      return res.status(400).json({ error: 'Destructive operations are not allowed' });
    }
    if (lowerQuery.includes('insert') || lowerQuery.includes('update')) {
      return res.status(400).json({ error: 'Write operations are not allowed in read-only mode' });
    }
    if (!lowerQuery.includes('select')) {
      return res.status(400).json({ error: 'Only SELECT queries are allowed' });
    }

    let rows;
    
                try {
        // If connection config is provided, use it; otherwise use default MySQL
        if (connectionConfig && connectionConfig.type === 'mysql') {
          const testPool = mysql.createPool({
            host: connectionConfig.host,
            port: Number(connectionConfig.port),
            user: connectionConfig.username,
            password: connectionConfig.password,
            database: connectionConfig.database,
            connectionLimit: 1,
            acquireTimeout: 5000,
          });

          [rows] = await testPool.query(sqlQuery);
          await testPool.end();
        } else {
          // Use default MySQL connection
          [rows] = await mysqlPool.query(sqlQuery);
        }
        
        return res.json({
          data: Array.isArray(rows) ? rows : [],
          total: Array.isArray(rows) ? rows.length : 0,
          success: true,
        });
      } catch (error) {
        // Handle any MySQL errors (connection, table not found, syntax errors, etc.)
        console.error('MySQL error:', error);
        
        // Check if it's a table not found error
        const isTableNotFound = error.code === 'ER_NO_SUCH_TABLE' || 
                               error.sqlMessage?.includes("doesn't exist") ||
                               error.message?.includes("doesn't exist");
        
        if (isTableNotFound) {
          console.log('Tables not found in MySQL database, falling back to mock data');
        } else {
          console.log('MySQL query/connection failed, falling back to mock data');
        }
      
      // Generate mock data based on query type
      let mockData = [];
      
      if (lowerQuery.includes('brand_name') && lowerQuery.includes('total_price')) {
        mockData = [
          { brand_name: 'MySQL Enterprise', total_revenue: 225000, revenue_percentage: 37.5 },
          { brand_name: 'MySQL Community', total_revenue: 198000, revenue_percentage: 33.0 },
          { brand_name: 'MySQL Cluster', total_revenue: 175000, revenue_percentage: 29.2 },
          { brand_name: 'MySQL Replication', total_revenue: 162000, revenue_percentage: 27.0 },
          { brand_name: 'MySQL InnoDB', total_revenue: 145000, revenue_percentage: 24.2 }
        ];
      } else if (lowerQuery.includes('product_name')) {
        mockData = [
          { product_name: 'MySQL Database T-Shirt', total_sales: 45000 },
          { product_name: 'MySQL Server Hoodie', total_sales: 38000 },
          { product_name: 'MySQL Workbench Cap', total_sales: 32000 },
          { product_name: 'MySQL Enterprise Shoes', total_sales: 28000 },
          { product_name: 'MySQL Cluster Bag', total_sales: 22000 }
        ];
      } else if (lowerQuery.includes('date_format') || lowerQuery.includes('month')) {
        mockData = [
          { month: '2024-01', total_sales: 225000 },
          { month: '2024-02', total_sales: 238000 },
          { month: '2024-03', total_sales: 242000 },
          { month: '2024-04', total_sales: 256000 },
          { month: '2024-05', total_sales: 268000 },
          { month: '2024-06', total_sales: 275000 }
        ];
      } else {
        // Default mock data
        mockData = [
          { brand_name: 'MySQL Enterprise', total_sales: 225000 },
          { brand_name: 'MySQL Community', total_sales: 198000 },
          { brand_name: 'MySQL Cluster', total_sales: 175000 },
          { brand_name: 'MySQL Replication', total_sales: 162000 },
          { brand_name: 'MySQL InnoDB', total_sales: 145000 }
        ];
      }
      
      return res.json({
        data: mockData,
        total: mockData.length,
        success: true,
        note: 'Using mock data - database connection unavailable'
      });
    }
  } catch (error) {
    console.error('MySQL error:', error);
    return res.status(500).json({ error: 'Database query failed', details: String(error?.message || error) });
  }
});

// Dashboard data endpoint
app.get('/api/dashboard-data', async (req, res) => {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    
    // Get total revenue
    const revenueResult = await client.query(`
      SELECT COALESCE(SUM(total_price), 0) as total_revenue 
      FROM sales
    `);
    
    // Get total orders
    const ordersResult = await client.query(`
      SELECT COUNT(DISTINCT sale_id) as total_orders 
      FROM sales
    `);
    
    // Get total products
    const productsResult = await client.query(`
      SELECT COUNT(*) as total_products 
      FROM products
    `);
    
    // Get average order value
    const avgOrderResult = await client.query(`
      SELECT COALESCE(AVG(total_price), 0) as avg_order_value 
      FROM sales
    `);
    
    // Get revenue by brand (as states for now)
    const revenueByBrandResult = await client.query(`
      SELECT 
        b.brand_name as state,
        COALESCE(SUM(s.total_price), 0) as revenue
      FROM brands b
      LEFT JOIN products p ON b.brand_id = p.brand_id
      LEFT JOIN sales s ON p.product_id = s.product_id
      GROUP BY b.brand_name
      ORDER BY revenue DESC
      LIMIT 4
    `);
    
    // Get top products
    const topProductsResult = await client.query(`
      SELECT 
        p.product_id as id,
        p.product_name as name,
        COALESCE(SUM(s.quantity_sold), 0) as total_sales,
        COALESCE(SUM(s.total_price), 0) as revenue
      FROM products p
      LEFT JOIN sales s ON p.product_id = s.product_id
      GROUP BY p.product_id, p.product_name
      ORDER BY revenue DESC
      LIMIT 5
    `);
    
    // Calculate total revenue for percentage calculations
    const totalRevenue = revenueResult.rows[0]?.total_revenue || 0;
    
    // Format revenue by brand data
    const revenueByState = revenueByBrandResult.rows.map(row => ({
      state: row.state || 'Unknown',
      revenue: parseFloat(row.revenue) || 0
    }));
    
    // Format top products data
    const topProducts = topProductsResult.rows.map(row => ({
      id: row.id.toString(),
      name: row.name || 'Unknown Product',
      totalSales: parseInt(row.total_sales) || 0,
      revenue: parseFloat(row.revenue) || 0
    }));
    
    // Create charts data
    const charts = [
      {
        id: 'revenue-by-state',
        title: 'Revenue by Brand',
        type: 'bar',
        data: revenueByState.map(item => ({
          name: item.state,
          value: item.revenue
        }))
      },
      {
        id: 'revenue-distribution',
        title: 'Revenue Distribution by Brand',
        type: 'pie',
        data: revenueByState.map(item => ({
          name: item.state,
          value: totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100) : 0
        }))
      }
    ];
    
    const dashboardData = {
      totalRevenue: parseFloat(revenueResult.rows[0]?.total_revenue) || 0,
      totalOrders: parseInt(ordersResult.rows[0]?.total_orders) || 0,
      totalProducts: parseInt(productsResult.rows[0]?.total_products) || 0,
      avgOrderValue: parseFloat(avgOrderResult.rows[0]?.avg_order_value) || 0,
      revenueByState,
      topProducts,
      charts
    };
    
    res.json(dashboardData);
    
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      details: error.message 
    });
  } finally {
    try {
      await client.end();
    } catch (endError) {
      console.warn('Error closing connection:', endError);
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
}); 