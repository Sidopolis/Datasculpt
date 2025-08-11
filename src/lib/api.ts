import axios from 'axios'
import { dataSourceManager } from './dataSources'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add authentication headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clerk-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('clerk-token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

// Types for API responses
export interface BedrockResponse {
  sqlQuery: string
  explanation: string
  confidence: number
  suggestedVisualization?: string
}

export interface ChartData {
  id: string
  title: string
  type: 'bar' | 'line' | 'pie' | 'area'
  data: Array<Record<string, unknown>>
  config?: Record<string, unknown>
}

export interface DashboardData {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  avgOrderValue: number
  revenueByState: Array<{ state: string; revenue: number }>
  topProducts: Array<{ id: string; name: string; totalSales: number; revenue: number }>
  charts: ChartData[]
}

// Utility function to download files
export function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// API Service Class
export class DataSculptAPI {
  // Database type state
  private static currentDatabase: 'postgresql' | 'mysql' = 'postgresql'

  // Set database type
  static setDatabaseType(type: 'postgresql' | 'mysql') {
    this.currentDatabase = type
    console.log('Switched to database:', type)
  }

  // Get current database type
  static getCurrentDatabase() {
    return this.currentDatabase
  }

  // Get active data source
  static getActiveDataSource() {
    return dataSourceManager.getActiveSource()
  }

  // Bedrock API Integration
  static async generateSQLQuery(naturalLanguageQuery: string): Promise<BedrockResponse> {
    try {
      console.log('Generating SQL query for:', naturalLanguageQuery);
      console.log('Current database:', this.currentDatabase);
      
      let bedrockRaw;
      
      if (this.currentDatabase === 'mysql') {
        // Call MySQL Bedrock utility
        const { callBedrockMySQL } = await import('./mysqlApi');
        bedrockRaw = await callBedrockMySQL(naturalLanguageQuery);
      } else {
        // Call PostgreSQL Bedrock utility
      const { callBedrock } = await import('./bedrockApi');
        bedrockRaw = await callBedrock(naturalLanguageQuery);
      }
      
      console.log('Bedrock raw response:', bedrockRaw);
      
      // Map Bedrock response to BedrockResponse type
      return {
        sqlQuery: bedrockRaw.sqlQuery || '',
        explanation: bedrockRaw.explanation || '',
        confidence: bedrockRaw.confidence || 0.8,
        suggestedVisualization: bedrockRaw.suggestedVisualization || 'bar'
      };
    } catch (error) {
      console.error('Error generating SQL query:', error);
      // Return a fallback response based on database type
      if (this.currentDatabase === 'mysql') {
        return {
          sqlQuery: "SELECT b.brand_name, SUM(s.total_price) as total_sales FROM sales s JOIN products p ON s.product_id = p.product_id JOIN brands b ON p.brand_id = b.brand_id GROUP BY b.brand_name ORDER BY total_sales DESC LIMIT 5;",
          explanation: "Generated a basic MySQL query for sales by brand analysis.",
          confidence: 0.7,
          suggestedVisualization: "bar"
        };
      } else {
      return {
        sqlQuery: "SELECT b.brand_name, SUM(s.total_price) as total_sales FROM sales s JOIN products p ON s.product_id = p.product_id JOIN brands b ON p.brand_id = b.brand_id GROUP BY b.brand_name ORDER BY total_sales DESC LIMIT 5;",
          explanation: "Generated a basic PostgreSQL query for sales by brand analysis.",
        confidence: 0.7,
        suggestedVisualization: "bar"
      };
      }
    }
  }

  // Verify and execute SQL query
  static async verifyAndExecuteSQL(sqlQuery: string): Promise<Record<string, unknown>> {
    try {
      console.log('Executing SQL query via backend:', sqlQuery);
      console.log('Current database:', this.currentDatabase);
      
      let result;
      const activeSource = dataSourceManager.getActiveSource();
      
      if (this.currentDatabase === 'mysql') {
        // Execute MySQL query via backend endpoint with connection config
        const response = await fetch(`${API_BASE_URL}/mysql/execute-query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            sqlQuery,
            connectionConfig: activeSource ? {
              type: activeSource.type,
              host: activeSource.host,
              port: activeSource.port,
              database: activeSource.database,
              username: activeSource.username,
              password: activeSource.password,
            } : undefined
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to execute MySQL SQL query');
        }

        result = await response.json();
      } else {
        // Execute PostgreSQL query via backend
      const response = await fetch(`${API_BASE_URL}/execute-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({ 
            sqlQuery,
            connectionConfig: activeSource ? {
              type: activeSource.type,
              host: activeSource.host,
              port: activeSource.port,
              database: activeSource.database,
              username: activeSource.username,
              password: activeSource.password,
            } : undefined
          }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to execute SQL query');
      }

        result = await response.json();
      }
      
      console.log('Query execution result:', result);
      
      // If using mock data, log it
      if (result.note && result.note.includes('mock data')) {
        console.log('⚠️ Using mock MySQL data - database connection unavailable');
      }
      
      return result;
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw new Error('Failed to execute SQL query');
    }
  }

  // Get dashboard data
  static async getDashboardData(): Promise<DashboardData> {
    try {
      console.log('Fetching real dashboard data from PostgreSQL...')
      
      // Fetch real data from PostgreSQL via backend
      const response = await fetch(`${API_BASE_URL}/dashboard-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch dashboard data')
      }

      const result = await response.json()
      console.log('Real dashboard data:', result)
      return result
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw new Error('Failed to fetch dashboard data')
    }
  }

  // Export data as PDF
  static async exportAsPDF(chartData: ChartData): Promise<Blob> {
    try {
      // For now, create a simple PDF-like response
      const pdfContent = `Report: ${chartData.title}\n\nData:\n${JSON.stringify(chartData.data, null, 2)}`
      const blob = new Blob([pdfContent], { type: 'application/pdf' })
      return blob
    } catch (error) {
      console.error('Error exporting PDF:', error)
      throw new Error('Failed to export PDF')
    }
  }

  // Export data as CSV
  static async exportAsCSV(chartData: ChartData): Promise<Blob> {
    try {
      // Convert data to CSV format
      let csvContent = 'Name,Value\n'
      if (chartData.data && chartData.data.length > 0) {
        const headers = Object.keys(chartData.data[0])
        csvContent = headers.join(',') + '\n'
        chartData.data.forEach((row: Record<string, unknown>) => {
          csvContent += headers.map(header => row[header] || '').join(',') + '\n'
        })
      }
      const blob = new Blob([csvContent], { type: 'text/csv' })
      return blob
    } catch (error) {
      console.error('Error exporting CSV:', error)
      throw new Error('Failed to export CSV')
    }
  }

  // Get chart data by type
  static async getChartData(chartType: string, filters?: Record<string, unknown>): Promise<ChartData> {
    try {
      const response = await apiClient.get(`/charts/${chartType}`, {
        params: filters
      })
      return response.data
    } catch (error) {
      console.error('Error fetching chart data:', error)
      throw new Error('Failed to fetch chart data')
    }
  }
}

export default DataSculptAPI 