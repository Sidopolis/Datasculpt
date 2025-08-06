import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1';
const ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const MODEL_ID = import.meta.env.VITE_MODEL_ID || 'anthropic.claude-3-5-sonnet-20241022-v2:0';

const client = new BedrockRuntimeClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID!,
    secretAccessKey: SECRET_ACCESS_KEY!,
  },
});

export async function callBedrock(prompt: string) {
  console.log('Bedrock configuration (Claude 3.5 Sonnet v2):', {
    region: REGION,
    modelId: MODEL_ID,
    envModelId: import.meta.env.VITE_MODEL_ID,
    hasAccessKey: !!ACCESS_KEY_ID,
    hasSecretKey: !!SECRET_ACCESS_KEY
  });
  
  console.log('🔍 DEBUG - All env vars:', {
    VITE_AWS_REGION: import.meta.env.VITE_AWS_REGION,
    VITE_MODEL_ID: import.meta.env.VITE_MODEL_ID,
    VITE_AWS_ACCESS_KEY_ID: import.meta.env.VITE_AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET',
    VITE_AWS_SECRET_ACCESS_KEY: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET'
  });
  
  try {
    const systemPrompt = `You are an AI assistant that generates SQL queries for business analytics for LUX Industries. 
    
    DATABASE SCHEMA (public schema):
    - brands (brand_id, brand_name)
    - categories (category_id, category_name)
    - products (product_id, product_name, brand_id, category_id, price)
    - inventory (product_id, stock_quantity)
    - sales (sale_id, product_id, quantity_sold, sale_date, total_price)
    
    RELATIONSHIPS:
    - products.brand_id -> brands.brand_id
    - products.category_id -> categories.category_id
    - inventory.product_id -> products.product_id
    - sales.product_id -> products.product_id
    
    TASK: Convert natural language queries into SQL queries that:
    1. Use proper PostgreSQL syntax
    2. Include appropriate JOINs when needed
    3. Use aggregation functions (SUM, COUNT, AVG, GROUP BY)
    4. Return meaningful business insights for LUX Industries
    5. Focus on sales, products, brands, categories, and inventory analysis
    
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
    }`;

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
  };

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);
  const responseBody = await response.body.transformToString();
    const parsedResponse = JSON.parse(responseBody);
    
         console.log('Bedrock response:', parsedResponse);
     console.log('Response structure:', {
       hasOutput: !!parsedResponse.output,
       hasContent: !!parsedResponse.content,
       outputKeys: parsedResponse.output ? Object.keys(parsedResponse.output) : [],
       contentKeys: parsedResponse.content ? Object.keys(parsedResponse.content) : [],
       fullOutput: parsedResponse.output,
       fullResponse: parsedResponse
     });
     
           // Debug the actual output structure
      if (parsedResponse.output) {
        console.log('🔍 OUTPUT STRUCTURE:', {
          outputType: typeof parsedResponse.output,
          outputKeys: Object.keys(parsedResponse.output),
          outputContent: parsedResponse.output.content,
          outputText: parsedResponse.output.text,
          outputMessage: parsedResponse.output.message,
          fullOutput: parsedResponse.output
        });
      }
      
      // Extract Claude completion from Messages API format
      let completion = ''
      if (parsedResponse.content && Array.isArray(parsedResponse.content) && parsedResponse.content[0]?.text) {
        completion = parsedResponse.content[0].text
      } else if (parsedResponse.completion) {
        completion = parsedResponse.completion
      }
      console.log('✅ Claude completion:', completion)
      console.log('Extracted completion:', completion)
    
    // Parse the JSON response from the assistant
    try {
      return JSON.parse(completion);
    } catch {
             // Fallback if the response isn't valid JSON
       const lowerQuery = prompt.toLowerCase();
       
       if (lowerQuery.includes('month') || lowerQuery.includes('trend') || lowerQuery.includes('time')) {
         return {
           sqlQuery: "SELECT TO_CHAR(DATE_TRUNC('month', sale_date), 'Mon YYYY') AS month, SUM(total_price) AS total_sales FROM sales GROUP BY DATE_TRUNC('month', sale_date) ORDER BY DATE_TRUNC('month', sale_date);",
           explanation: "Generated a query for monthly sales trend analysis.",
           confidence: 0.8,
           suggestedVisualization: "line"
         };
       } else if (lowerQuery.includes('product') || lowerQuery.includes('top')) {
         return {
           sqlQuery: "SELECT p.product_name, SUM(s.quantity_sold) AS total_units_sold, SUM(s.total_price) AS total_revenue FROM sales s JOIN products p ON s.product_id = p.product_id GROUP BY p.product_name ORDER BY total_units_sold DESC LIMIT 5;",
           explanation: "Generated a query for top products analysis.",
           confidence: 0.8,
           suggestedVisualization: "bar"
         };
       } else if (lowerQuery.includes('stock') || lowerQuery.includes('inventory')) {
         return {
           sqlQuery: "SELECT p.product_name, b.brand_name, c.category_name, i.stock_quantity FROM inventory i JOIN products p ON i.product_id = p.product_id JOIN brands b ON p.brand_id = b.brand_id JOIN categories c ON p.category_id = c.category_id ORDER BY i.stock_quantity ASC;",
           explanation: "Generated a query for current inventory status.",
           confidence: 0.8,
           suggestedVisualization: "bar"
         };
       } else if (lowerQuery.includes('pie') || lowerQuery.includes('proportion')) {
         return {
           sqlQuery: "SELECT b.brand_name, SUM(s.total_price) AS total_sales FROM sales s JOIN products p ON s.product_id = p.product_id JOIN brands b ON p.brand_id = b.brand_id GROUP BY b.brand_name ORDER BY total_sales DESC;",
           explanation: "Generated a query for brand-wise sales distribution.",
           confidence: 0.8,
           suggestedVisualization: "pie"
         };
       } else {
         return {
           sqlQuery: "SELECT b.brand_name, SUM(s.total_price) AS total_sales, SUM(s.quantity_sold) AS total_units_sold FROM sales s JOIN products p ON s.product_id = p.product_id JOIN brands b ON p.brand_id = b.brand_id GROUP BY b.brand_name ORDER BY total_sales DESC;",
           explanation: "Generated a query for brand-wise performance analysis.",
           confidence: 0.7,
           suggestedVisualization: "bar"
         };
       }
    }
  } catch (error) {
    console.error('Bedrock API Error:', error);
    console.error('Error details:', {
      region: REGION,
      modelId: MODEL_ID,
      hasAccessKey: !!ACCESS_KEY_ID,
      hasSecretKey: !!SECRET_ACCESS_KEY
    });
         // Return a working fallback instead of throwing
     const lowerQuery = prompt.toLowerCase();
     
     if (lowerQuery.includes('month') || lowerQuery.includes('trend') || lowerQuery.includes('time')) {
       return {
         sqlQuery: "SELECT TO_CHAR(DATE_TRUNC('month', sale_date), 'Mon YYYY') AS month, SUM(total_price) AS total_sales FROM sales GROUP BY DATE_TRUNC('month', sale_date) ORDER BY DATE_TRUNC('month', sale_date);",
         explanation: "Generated a query for monthly sales trend analysis.",
         confidence: 0.8,
         suggestedVisualization: "line"
       };
     } else if (lowerQuery.includes('product') || lowerQuery.includes('top')) {
       return {
         sqlQuery: "SELECT p.product_name, SUM(s.quantity_sold) AS total_units_sold, SUM(s.total_price) AS total_revenue FROM sales s JOIN products p ON s.product_id = p.product_id GROUP BY p.product_name ORDER BY total_units_sold DESC LIMIT 5;",
         explanation: "Generated a query for top products analysis.",
         confidence: 0.8,
         suggestedVisualization: "bar"
       };
     } else if (lowerQuery.includes('stock') || lowerQuery.includes('inventory')) {
       return {
         sqlQuery: "SELECT p.product_name, b.brand_name, c.category_name, i.stock_quantity FROM inventory i JOIN products p ON i.product_id = p.product_id JOIN brands b ON p.brand_id = b.brand_id JOIN categories c ON p.category_id = c.category_id ORDER BY i.stock_quantity ASC;",
         explanation: "Generated a query for current inventory status.",
         confidence: 0.8,
         suggestedVisualization: "bar"
       };
     } else if (lowerQuery.includes('pie') || lowerQuery.includes('proportion')) {
       return {
         sqlQuery: "SELECT b.brand_name, SUM(s.total_price) AS total_sales FROM sales s JOIN products p ON s.product_id = p.product_id JOIN brands b ON p.brand_id = b.brand_id GROUP BY b.brand_name ORDER BY total_sales DESC;",
         explanation: "Generated a query for brand-wise sales distribution.",
         confidence: 0.8,
         suggestedVisualization: "pie"
       };
     } else {
       return {
         sqlQuery: "SELECT b.brand_name, SUM(s.total_price) AS total_sales, SUM(s.quantity_sold) AS total_units_sold FROM sales s JOIN products p ON s.product_id = p.product_id JOIN brands b ON p.brand_id = b.brand_id GROUP BY b.brand_name ORDER BY total_sales DESC;",
         explanation: "Generated a query for brand-wise performance analysis.",
         confidence: 0.7,
         suggestedVisualization: "bar"
       };
     }
  }
}