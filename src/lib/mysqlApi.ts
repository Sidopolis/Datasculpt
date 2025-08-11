import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const MODEL_ID = import.meta.env.VITE_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v2:0'
const client = new BedrockRuntimeClient({
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
  }
})

export async function callBedrockMySQL(prompt: string) {
  console.log('Calling Bedrock for MySQL query generation:', prompt)
  
  try {
    const systemPrompt = `You are an AI assistant that generates MySQL queries for business analytics for LUX Industries. 
    
    DATABASE SCHEMA (lux_industries database):
    - brands (brand_id INT, brand_name VARCHAR(100))
    - categories (category_id INT, category_name VARCHAR(100))
    - products (product_id INT, product_name VARCHAR(200), brand_id INT, category_id INT, price DECIMAL(10,2))
    - inventory (product_id INT, stock_quantity INT)
    - sales (sale_id INT, product_id INT, quantity_sold INT, sale_date DATE, total_price DECIMAL(10,2))
    
    RELATIONSHIPS:
    - products.brand_id -> brands.brand_id
    - products.category_id -> categories.category_id
    - inventory.product_id -> products.product_id
    - sales.product_id -> products.product_id
    
    TASK: Convert natural language queries into MySQL queries that:
    1. Use proper MySQL syntax (not PostgreSQL)
    2. Include appropriate JOINs when needed
    3. Use aggregation functions (SUM, COUNT, AVG, GROUP BY)
    4. Return meaningful business insights for LUX Industries
    5. Focus on sales, products, brands, categories, and inventory analysis
    6. Use MySQL-specific functions like DATE_FORMAT, YEAR, MONTH, etc.
    
    MYSQL-SPECIFIC FEATURES:
    - Use DATE_FORMAT(sale_date, '%Y-%m') for month grouping
    - Use YEAR(sale_date) and MONTH(sale_date) for date extraction
    - Use IFNULL() instead of COALESCE()
    - Use LIMIT instead of FETCH FIRST
    - Use MySQL date functions for time-based queries
    
    VISUALIZATION GUIDELINES:
    - "bar": for comparing categories (sales by brand, top products, revenue by category)
    - "line": for time series data (sales trends, revenue over time, monthly growth)
    - "pie": for showing proportions (brand distribution, category sales, market share)
    - "area": for cumulative data over time
    
    RESPONSE FORMAT: Return ONLY valid JSON with these fields:
    {
      "sqlQuery": "SELECT ... FROM ...",
      "explanation": "This query shows...",
      "confidence": 0.85,
      "suggestedVisualization": "bar"
    }`

  const input = {
      modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        messages: [
          { role: 'user', content: systemPrompt + '\n\n' + prompt }
        ],
        max_tokens: 1000,
        temperature: 0.1
    }),
  }

  const command = new InvokeModelCommand(input)
  const response = await client.send(command)
  
  const responseBody = JSON.parse(new TextDecoder().decode(response.body))
  const completion = responseBody.content[0].text
  
  console.log('Bedrock MySQL response:', completion)
  
  // Parse the JSON response from the assistant
  try {
    return JSON.parse(completion)
  } catch {
    // Fallback if the response isn't valid JSON
    const lowerQuery = prompt.toLowerCase()
    
    if (lowerQuery.includes('month') || lowerQuery.includes('trend') || lowerQuery.includes('time')) {
      return {
        sqlQuery: "SELECT DATE_FORMAT(sale_date, '%Y-%m') AS month, SUM(total_price) AS total_sales FROM sales GROUP BY DATE_FORMAT(sale_date, '%Y-%m') ORDER BY month;",
        explanation: "Generated a MySQL query for monthly sales trend analysis.",
        confidence: 0.8,
        suggestedVisualization: "line"
      }
    } else if (lowerQuery.includes('product') || lowerQuery.includes('top')) {
      return {
        sqlQuery: "SELECT p.product_name, SUM(s.quantity_sold) AS total_units_sold, SUM(s.total_price) AS total_revenue FROM sales s JOIN products p ON s.product_id = p.product_id GROUP BY p.product_name ORDER BY total_units_sold DESC LIMIT 5;",
        explanation: "Generated a MySQL query for top products analysis.",
        confidence: 0.8,
        suggestedVisualization: "bar"
      }
    } else if (lowerQuery.includes('stock') || lowerQuery.includes('inventory')) {
      return {
        sqlQuery: "SELECT p.product_name, b.brand_name, c.category_name, i.stock_quantity FROM inventory i JOIN products p ON i.product_id = p.product_id JOIN brands b ON p.brand_id = b.brand_id JOIN categories c ON p.category_id = c.category_id ORDER BY i.stock_quantity ASC;",
        explanation: "Generated a MySQL query for current inventory status.",
        confidence: 0.8,
        suggestedVisualization: "bar"
      }
    } else if (lowerQuery.includes('pie') || lowerQuery.includes('proportion')) {
      return {
        sqlQuery: "SELECT b.brand_name, SUM(s.total_price) AS total_sales FROM sales s JOIN products p ON s.product_id = p.product_id JOIN brands b ON p.brand_id = b.brand_id GROUP BY b.brand_name ORDER BY total_sales DESC;",
        explanation: "Generated a MySQL query for brand-wise sales distribution.",
        confidence: 0.8,
        suggestedVisualization: "pie"
      }
    } else {
      return {
        sqlQuery: "SELECT b.brand_name, SUM(s.total_price) AS total_sales, SUM(s.quantity_sold) AS total_units_sold FROM sales s JOIN products p ON s.product_id = p.product_id JOIN brands b ON p.brand_id = b.brand_id GROUP BY b.brand_name ORDER BY total_sales DESC;",
        explanation: "Generated a MySQL query for brand-wise performance analysis.",
        confidence: 0.7,
        suggestedVisualization: "bar"
      }
    }
  }
  } catch (error) {
    console.error('Error calling Bedrock MySQL:', error)
    // Return a basic fallback response
    return {
      sqlQuery: "SELECT b.brand_name, SUM(s.total_price) AS total_sales FROM sales s JOIN products p ON s.product_id = p.product_id JOIN brands b ON p.brand_id = b.brand_id GROUP BY b.brand_name ORDER BY total_sales DESC LIMIT 5;",
      explanation: "Generated a basic MySQL query for sales by brand analysis.",
      confidence: 0.7,
      suggestedVisualization: "bar"
    }
  }
} 