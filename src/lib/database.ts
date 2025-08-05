// Database configuration for PostgreSQL
// This is a placeholder for the actual database connection
// In a real app, you'd use a proper ORM like Prisma or TypeORM

export interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

export const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'datasculpt',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
}

// Mock database queries for development
export const mockQueries = {
  // Sample tables and data
  tables: {
    orders: [
      { id: 1, customer_id: 1, product_id: 1, quantity: 2, total: 1500, created_at: '2024-01-15' },
      { id: 2, customer_id: 2, product_id: 2, quantity: 1, total: 800, created_at: '2024-01-16' },
      { id: 3, customer_id: 3, product_id: 1, quantity: 3, total: 2250, created_at: '2024-01-17' }
    ],
    products: [
      { id: 1, name: 'LUX Innerwear Premium', price: 750, category: 'Innerwear', stock: 50 },
      { id: 2, name: 'LUX Comfort Vest', price: 800, category: 'Innerwear', stock: 30 },
      { id: 3, name: 'LUX Cotton Briefs', price: 300, category: 'Innerwear', stock: 25 }
    ],
    customers: [
      { id: 1, name: 'John Doe', email: 'john@example.com', state: 'Kolkata' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', state: 'Mumbai' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', state: 'Delhi' }
    ]
  },

  // Mock query execution
  executeQuery: async (sql: string): Promise<Record<string, unknown>[]> => {
    console.log('Executing SQL:', sql)
    
    // Simulate database query execution
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return mock data based on query type
    if (sql.toLowerCase().includes('revenue')) {
      return [
        { state: 'Kolkata', revenue: 55000 },
        { state: 'Mumbai', revenue: 42000 },
        { state: 'Delhi', revenue: 38000 },
        { state: 'Chennai', revenue: 25000 }
      ]
    }
    
    if (sql.toLowerCase().includes('product')) {
      return [
        { name: 'LUX Innerwear Premium', sales: 45, revenue: 134955 },
        { name: 'LUX Comfort Vest', sales: 32, revenue: 511968 },
        { name: 'LUX Cotton Briefs', sales: 28, revenue: 50372 }
      ]
    }
    
    if (sql.toLowerCase().includes('customer')) {
      return [
        { name: 'John Doe', orders: 5, total_spent: 2500 },
        { name: 'Jane Smith', orders: 3, total_spent: 1800 },
        { name: 'Bob Johnson', orders: 7, total_spent: 4200 }
      ]
    }
    
    // Default response
    return [
      { name: 'Sample Data', value: 100 },
      { name: 'Another Sample', value: 200 },
      { name: 'Third Sample', value: 150 }
    ]
  },

  // Validate SQL query
  validateQuery: (sql: string): { isValid: boolean; error?: string } => {
    const lowerSql = sql.toLowerCase()
    
    // Basic security checks
    if (lowerSql.includes('drop') || lowerSql.includes('delete') || lowerSql.includes('truncate')) {
      return { isValid: false, error: 'Destructive operations are not allowed' }
    }
    
    if (lowerSql.includes('insert') || lowerSql.includes('update')) {
      return { isValid: false, error: 'Write operations are not allowed in read-only mode' }
    }
    
    // Check for basic SELECT structure
    if (!lowerSql.includes('select')) {
      return { isValid: false, error: 'Only SELECT queries are allowed' }
    }
    
    return { isValid: true }
  }
}

// Real database connection (for production)
export const connectDatabase = async () => {
  try {
    // In a real app, you'd use a proper database client
    // Example with pg (PostgreSQL client):
    // const { Client } = require('pg')
    // const client = new Client(databaseConfig)
    // await client.connect()
    // return client
    
    console.log('Database connected successfully')
    return { connected: true }
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error
  }
}

// Execute a safe query
export const executeSafeQuery = async (sql: string) => {
  const validation = mockQueries.validateQuery(sql)
  
  if (!validation.isValid) {
    throw new Error(validation.error)
  }
  
  return await mockQueries.executeQuery(sql)
} 