import React, { useState, useEffect } from 'react'
import { DashboardHeader } from './DashboardHeader'
import { Sidebar } from './Sidebar'
import { StatCard } from './StatCard'
import { ChartContainer } from '../charts/ChartContainer'
import FloatingChat from '../ai/FloatingChat.new'
import { DataSculptAPI, DashboardData } from '../../lib/api'
import { dataSourceManager } from '../../lib/dataSources'
import { Package, TrendingUp, ShoppingCart, Users, AlertCircle } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Listen for database changes and refresh data
  useEffect(() => {
    const handleDatabaseChange = () => {
      console.log('Database changed, refreshing dashboard data...')
      fetchDashboardData()
    }

    // Check for database changes every 2 seconds
    const interval = setInterval(() => {
      const activeSource = dataSourceManager.getActiveSource()
      const currentApiDatabase = DataSculptAPI.getCurrentDatabase()
      
      if (activeSource && activeSource.type !== currentApiDatabase) {
        console.log(`Database type mismatch: API=${currentApiDatabase}, Active=${activeSource.type}`)
        DataSculptAPI.setDatabaseType(activeSource.type as 'postgresql' | 'mysql')
        handleDatabaseChange()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Starting dashboard data fetch...')
      console.log('Current database type:', DataSculptAPI.getCurrentDatabase())
      const apiData = await DataSculptAPI.getDashboardData()
      console.log('Dashboard data received:', apiData)
      setData(apiData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      console.error('Error details:', error)
      
      // Try to get more details about the error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error message:', errorMessage)
      
      setError(`Failed to load dashboard data: ${errorMessage}`)
      
      // Set fallback mock data
      const fallbackData = {
        totalRevenue: 2450000,
        totalOrders: 1245,
        totalProducts: 850,
        avgOrderValue: 1968,
        revenueByState: [
          { state: 'Lyra Division', revenue: 650000 },
          { state: 'EBO Division', revenue: 580000 },
          { state: 'Ecom Division', revenue: 520000 },
          { state: 'Inferno Division', revenue: 480000 }
        ],
        topProducts: [
          { id: 'MAT001', name: 'Cotton T-Shirt', totalSales: 1250, revenue: 125000 },
          { id: 'MAT002', name: 'Denim Jeans', totalSales: 890, revenue: 178000 },
          { id: 'MAT003', name: 'Polo Shirt', totalSales: 750, revenue: 112500 },
          { id: 'MAT004', name: 'Casual Pants', totalSales: 620, revenue: 93000 },
          { id: 'MAT005', name: 'Sports Wear', totalSales: 580, revenue: 87000 }
        ],
        charts: [
          {
            id: 'revenue-by-state',
            title: 'Revenue by Division',
            type: 'bar' as const,
            data: [
              { name: 'Lyra Division', value: 650000 },
              { name: 'EBO Division', value: 580000 },
              { name: 'Ecom Division', value: 520000 },
              { name: 'Inferno Division', value: 480000 }
            ]
          },
          {
            id: 'revenue-distribution',
            title: 'Revenue Distribution by Division',
            type: 'pie' as const,
            data: [
              { name: 'Lyra Division', value: 26.5 },
              { name: 'EBO Division', value: 23.7 },
              { name: 'Ecom Division', value: 21.2 },
              { name: 'Inferno Division', value: 19.6 }
            ]
          }
        ]
      }
      console.log('Setting fallback data:', fallbackData)
      setData(fallbackData)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600 dark:border-slate-700 dark:border-t-slate-200 mx-auto mb-3"></div>
          <p className="text-slate-600 dark:text-slate-300 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Error Loading Dashboard</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center text-slate-600 dark:text-slate-300 text-sm">
          No data available. Please check your connection and try again.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-4 py-3">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Revenue"
              value={`₹${data.totalRevenue.toLocaleString()}`}
              change="+12.5%"
              changeType="positive"
              icon={TrendingUp}
            />
            <StatCard
              title="Total Orders"
              value={data.totalOrders.toLocaleString()}
              change="+8.2%"
              changeType="positive"
              icon={ShoppingCart}
            />
            <StatCard
              title="Products"
              value={data.totalProducts}
              icon={Package}
            />
            <StatCard
              title="Avg Order Value"
              value={`₹${Math.round(data.avgOrderValue).toLocaleString()}`}
              icon={Users}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {data.charts.map((chart) => (
              <ChartContainer
                key={chart.id}
                data={chart}
              />
            ))}
          </div>

          {/* Top Products and Revenue by Brand */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Products */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Top Products</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Best performing products</p>
                </div>
                <span className="inline-block bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded">Top 5</span>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {data.topProducts.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 rounded px-2 py-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-blue-50 dark:bg-blue-900 rounded flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{product.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{product.totalSales} units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">₹{product.revenue.toLocaleString()}</p>
                        <p className="text-xs text-green-600 dark:text-green-400">+{Math.floor(Math.random() * 20) + 5}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue by Brand */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Revenue by Brand</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Top performing brands</p>
                </div>
                <span className="inline-block bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-medium px-2 py-0.5 rounded">Top 4</span>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {data.revenueByState.slice(0, 4).map((item, index) => {
                    const share = (item.revenue / data.totalRevenue * 100).toFixed(1)
                    return (
                      <div key={item.state} className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 rounded px-2 py-1">
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-900 rounded flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{item.state}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{share}% share</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">₹{item.revenue.toLocaleString()}</p>
                          <p className="text-xs text-green-600 dark:text-green-400">+{Math.floor(Math.random() * 15) + 5}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Chat */}
          <div className="fixed bottom-6 right-6 z-50">
            <FloatingChat />
          </div>
        </main>
      </div>
    </div>
  )
}