import axios from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
const BEDROCK_API_URL = import.meta.env.VITE_BEDROCK_API_URL || 'https://bedrock-runtime.us-east-1.amazonaws.com'

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
  data: any[]
  config?: any
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

// API Service Class
export class DataSculptAPI {
  // Bedrock API Integration
  static async generateSQLQuery(naturalLanguageQuery: string): Promise<BedrockResponse> {
    try {
      const response = await apiClient.post('/bedrock/generate-sql', {
        query: naturalLanguageQuery,
        context: 'sales_data_analysis'
      })
      return response.data
    } catch (error) {
      console.error('Error generating SQL query:', error)
      throw new Error('Failed to generate SQL query')
    }
  }

  // Verify and execute SQL query
  static async verifyAndExecuteSQL(sqlQuery: string): Promise<any> {
    try {
      const response = await apiClient.post('/sql/verify-and-execute', {
        sqlQuery,
        database: 'postgresql'
      })
      return response.data
    } catch (error) {
      console.error('Error executing SQL query:', error)
      // Use local database for development
      const { executeSafeQuery } = await import('./database')
      return await executeSafeQuery(sqlQuery)
    }
  }

  // Get dashboard data
  static async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await apiClient.get('/dashboard/data')
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw new Error('Failed to fetch dashboard data')
    }
  }

  // Export data as PDF
  static async exportAsPDF(chartData: ChartData): Promise<Blob> {
    try {
      const response = await apiClient.post('/export/pdf', {
        chartData,
        format: 'pdf'
      }, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exporting PDF:', error)
      throw new Error('Failed to export PDF')
    }
  }

  // Export data as CSV
  static async exportAsCSV(chartData: ChartData): Promise<Blob> {
    try {
      const response = await apiClient.post('/export/csv', {
        chartData,
        format: 'csv'
      }, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exporting CSV:', error)
      throw new Error('Failed to export CSV')
    }
  }

  // Get chart data by type
  static async getChartData(chartType: string, filters?: any): Promise<ChartData> {
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