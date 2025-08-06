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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
}); 