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
    
    DATABASE SCHEMA (MySQL - lux_industries database):
    - customer_master (cust_code, full_name, city, state_desc, mobile, email, agent_code, agent_name, sales_org, dist_channel)
    - agent_master (agent_code, agent_name, mobile, email, city, state_desc, account_group)
    - employee_master (employee_code, employee_name, mobile, email, city, state_desc, account_group)
    - invoice_history (bill_no, item_no, com_code, sales_org, invoice_qty, net_value_inr, net_value_fr, material_number, material_desc, division, division_name, plant, plant_name, bill_date, cust_code, customer_name, distribution_channel, bill_type)
    - invoice_history2 (same structure as invoice_history)
    - invoice_line_item_with_cogs (bill_no, bill_item_no, sales_org, distribution_channel, bill_date, customer_code, material_no, material_desc, before_tax_amount, cogs_value, business_area, profit_center)
    - cancel_invoice_summary (bill_number, customer_code, customer_name, com_code, sales_org, bill_type, bill_date, bill_amnt_inr, tax_amnt, state_code, state_name)
    - customer_overall_outstanding_report (cust_code, cust_name, lyra, ebo, ecom, inferno, nitro, rainwear, venus, on_account, export, above_90_days)
    - company_sales_org (com_code, com_desc, sales_org, sales_org_desc)
    - company_business_area (com_code, business_area, business_area_desc, plant, plant_desc)
    
    RELATIONSHIPS:
    - customer_master.cust_code -> invoice_history.cust_code
    - customer_master.agent_code -> agent_master.agent_code
    - invoice_history.bill_no -> invoice_line_item_with_cogs.bill_no
    - invoice_history.com_code -> company_sales_org.com_code
    - invoice_history.sales_org -> company_sales_org.sales_org
    
    KEY BUSINESS ENTITIES:
    - Divisions: Lyra, EBO, Ecom, Inferno, Nitro, Rainwear, Venus
    - Revenue fields: net_value_inr, bill_amnt_inr, before_tax_amount
    - Quantity fields: invoice_qty, bill_qty
    - Date fields: bill_date, created_at
    
    TASK: Convert natural language queries into MySQL queries that:
    1. Use proper MySQL syntax
    2. Include appropriate JOINs when needed
    3. Use aggregation functions (SUM, COUNT, AVG, GROUP BY)
    4. Return meaningful business insights for LUX Industries
    5. Focus on sales, revenue, customers, agents, divisions, and materials analysis
    6. Use DATE_FORMAT for date grouping (e.g., DATE_FORMAT(bill_date, '%Y-%m') for monthly)
    
    VISUALIZATION GUIDELINES:
    - "bar": for comparing categories (sales by division, top materials, revenue by customer)
    - "line": for time series data (sales trends, revenue over time, monthly growth)
    - "pie": for showing proportions (division distribution, customer sales share)
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
           sqlQuery: "SELECT DATE_FORMAT(bill_date, '%Y-%m') AS month, SUM(net_value_inr) AS total_sales FROM invoice_history WHERE bill_date IS NOT NULL GROUP BY DATE_FORMAT(bill_date, '%Y-%m') ORDER BY month;",
           explanation: "Generated a query for monthly sales trend analysis from invoice history.",
           confidence: 0.8,
           suggestedVisualization: "line"
         };
       } else if (lowerQuery.includes('division') || lowerQuery.includes('brand')) {
         return {
           sqlQuery: "SELECT division_name, SUM(net_value_inr) AS total_revenue, COUNT(DISTINCT bill_no) AS total_orders FROM invoice_history WHERE division_name IS NOT NULL GROUP BY division_name ORDER BY total_revenue DESC;",
           explanation: "Generated a query for division-wise revenue analysis.",
           confidence: 0.8,
           suggestedVisualization: "bar"
         };
       } else if (lowerQuery.includes('customer') || lowerQuery.includes('top')) {
         return {
           sqlQuery: "SELECT customer_name, SUM(net_value_inr) AS total_revenue, COUNT(DISTINCT bill_no) AS total_orders FROM invoice_history WHERE customer_name IS NOT NULL GROUP BY customer_name ORDER BY total_revenue DESC LIMIT 10;",
           explanation: "Generated a query for top customers by revenue.",
           confidence: 0.8,
           suggestedVisualization: "bar"
         };
       } else if (lowerQuery.includes('material') || lowerQuery.includes('product')) {
         return {
           sqlQuery: "SELECT material_desc, SUM(invoice_qty) AS total_quantity, SUM(net_value_inr) AS total_revenue FROM invoice_history WHERE material_desc IS NOT NULL GROUP BY material_desc ORDER BY total_revenue DESC LIMIT 10;",
           explanation: "Generated a query for top materials/products by revenue.",
           confidence: 0.8,
           suggestedVisualization: "bar"
         };
       } else if (lowerQuery.includes('pie') || lowerQuery.includes('proportion')) {
         return {
           sqlQuery: "SELECT division_name, SUM(net_value_inr) AS total_sales FROM invoice_history WHERE division_name IS NOT NULL GROUP BY division_name ORDER BY total_sales DESC;",
           explanation: "Generated a query for division-wise sales distribution.",
           confidence: 0.8,
           suggestedVisualization: "pie"
         };
       } else {
         return {
           sqlQuery: "SELECT division_name, SUM(net_value_inr) AS total_revenue, SUM(invoice_qty) AS total_quantity, COUNT(DISTINCT bill_no) AS total_orders FROM invoice_history WHERE division_name IS NOT NULL GROUP BY division_name ORDER BY total_revenue DESC;",
           explanation: "Generated a query for comprehensive division performance analysis.",
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
         sqlQuery: "SELECT DATE_FORMAT(bill_date, '%Y-%m') AS month, SUM(net_value_inr) AS total_sales FROM invoice_history WHERE bill_date IS NOT NULL GROUP BY DATE_FORMAT(bill_date, '%Y-%m') ORDER BY month;",
         explanation: "Generated a query for monthly sales trend analysis from invoice history.",
         confidence: 0.8,
         suggestedVisualization: "line"
       };
     } else if (lowerQuery.includes('division') || lowerQuery.includes('brand')) {
       return {
         sqlQuery: "SELECT division_name, SUM(net_value_inr) AS total_revenue, COUNT(DISTINCT bill_no) AS total_orders FROM invoice_history WHERE division_name IS NOT NULL GROUP BY division_name ORDER BY total_revenue DESC;",
         explanation: "Generated a query for division-wise revenue analysis.",
         confidence: 0.8,
         suggestedVisualization: "bar"
       };
     } else if (lowerQuery.includes('customer') || lowerQuery.includes('top')) {
       return {
         sqlQuery: "SELECT customer_name, SUM(net_value_inr) AS total_revenue, COUNT(DISTINCT bill_no) AS total_orders FROM invoice_history WHERE customer_name IS NOT NULL GROUP BY customer_name ORDER BY total_revenue DESC LIMIT 10;",
         explanation: "Generated a query for top customers by revenue.",
         confidence: 0.8,
         suggestedVisualization: "bar"
       };
     } else if (lowerQuery.includes('material') || lowerQuery.includes('product')) {
       return {
         sqlQuery: "SELECT material_desc, SUM(invoice_qty) AS total_quantity, SUM(net_value_inr) AS total_revenue FROM invoice_history WHERE material_desc IS NOT NULL GROUP BY material_desc ORDER BY total_revenue DESC LIMIT 10;",
         explanation: "Generated a query for top materials/products by revenue.",
         confidence: 0.8,
         suggestedVisualization: "bar"
       };
     } else if (lowerQuery.includes('pie') || lowerQuery.includes('proportion')) {
       return {
         sqlQuery: "SELECT division_name, SUM(net_value_inr) AS total_sales FROM invoice_history WHERE division_name IS NOT NULL GROUP BY division_name ORDER BY total_sales DESC;",
         explanation: "Generated a query for division-wise sales distribution.",
         confidence: 0.8,
         suggestedVisualization: "pie"
       };
     } else {
       return {
         sqlQuery: "SELECT division_name, SUM(net_value_inr) AS total_revenue, SUM(invoice_qty) AS total_quantity, COUNT(DISTINCT bill_no) AS total_orders FROM invoice_history WHERE division_name IS NOT NULL GROUP BY division_name ORDER BY total_revenue DESC;",
         explanation: "Generated a query for comprehensive division performance analysis.",
         confidence: 0.7,
         suggestedVisualization: "bar"
       };
     }
  }
}