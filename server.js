import express from 'express';
import cors from 'cors';
import { Client } from 'pg';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const dbConfig = {
  host: 'ec2-3-237-189-104.compute-1.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'secure123',
};

// API endpoint to execute SQL queries
app.post('/api/execute-query', async (req, res) => {
  const { sqlQuery } = req.body;
  
  if (!sqlQuery) {
    return res.status(400).json({ error: 'SQL query is required' });
  }

  const client = new Client(dbConfig);
  
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

    // Connect to database
    await client.connect();
    
    // Execute query
    const result = await client.query(sqlQuery);
    
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
  } finally {
    try {
      await client.end();
    } catch (endError) {
      console.warn('Error closing connection:', endError);
    }
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