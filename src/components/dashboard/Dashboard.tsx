import React, { useState, useEffect } from 'react'
import { DashboardHeader } from './DashboardHeader'
import { Sidebar } from './Sidebar'
import { StatCard } from './StatCard'
import { ChartContainer } from '../charts/ChartContainer'
import { FloatingChat } from '../ai/FloatingChat'
import { DataSculptAPI, DashboardData } from '../../lib/api'
import { Package, TrendingUp, ShoppingCart, Users, AlertCircle } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    // Create mock data as fallback
    const mockData: DashboardData = {
      totalRevenue: 125000,
      totalOrders: 156,
      totalProducts: 10,
      avgOrderValue: 801,
      revenueByState: [
        { state: 'Kolkata', revenue: 55000 },
        { state: 'Mumbai', revenue: 42000 },
        { state: 'Delhi', revenue: 38000 },
        { state: 'Chennai', revenue: 25000 }
      ],
      topProducts: [
        { id: '1', name: 'LUX Innerwear Premium', totalSales: 45, revenue: 134955 },
        { id: '2', name: 'LUX Comfort Vest', totalSales: 32, revenue: 511968 },
        { id: '3', name: 'LUX Cotton Briefs', totalSales: 28, revenue: 50372 },
        { id: '4', name: 'LUX Sportswear', totalSales: 25, revenue: 124975 },
        { id: '5', name: 'LUX Nightwear', totalSales: 22, revenue: 28578 }
      ],
      charts: [
        {
          id: 'revenue-by-state',
          title: 'Revenue by State',
          type: 'bar',
          data: [
            { name: 'Kolkata', value: 55000 },
            { name: 'Mumbai', value: 42000 },
            { name: 'Delhi', value: 38000 },
            { name: 'Chennai', value: 25000 }
          ]
        },
        {
          id: 'revenue-distribution',
          title: 'Revenue Distribution',
          type: 'pie',
          data: [
            { name: 'Kolkata', value: 34.4 },
            { name: 'Mumbai', value: 26.3 },
            { name: 'Delhi', value: 23.8 },
            { name: 'Chennai', value: 15.6 }
          ]
        }
      ]
    }

    try {
      const apiData = await DataSculptAPI.getDashboardData()
      setData(apiData)
    } catch (error) {
      console.warn('API not available, using mock data:', error)
      setData(mockData)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600 mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-slate-600 mb-4 text-sm">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center text-slate-600 text-sm">
          No data available. Please check your connection and try again.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
            <div className="flex">
        <div className="flex flex-col">
          <Sidebar />
          {/* Quick Actions - Below Sidebar */}
          <div className="w-64 p-2">
                          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="space-y-2">
                <a 
                  href="/reports" 
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Generate Reports</p>
                      <p className="text-xs text-slate-600">AI-powered analysis</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Set Goals</p>
                      <p className="text-xs text-slate-600">Track performance</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <main className="flex-1 p-4">
          <div className="space-y-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.charts.map((chart) => (
                <ChartContainer key={chart.id} data={chart} />
              ))}
            </div>

            {/* Top Products and Revenue by State - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Top Products */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900">Top Products</h3>
                  <p className="text-sm text-slate-600 mt-1">Best performing products</p>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {data.topProducts.slice(0, 5).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{product.name}</p>
                            <p className="text-xs text-slate-500">{product.totalSales} units</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 text-sm">₹{product.revenue.toLocaleString()}</p>
                          <p className="text-xs text-green-600">+{Math.floor(Math.random() * 20) + 5}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* State Summary */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900">Revenue by State</h3>
                  <p className="text-sm text-slate-600 mt-1">Top performing regions</p>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {data.revenueByState.slice(0, 4).map((item, index) => {
                      const share = (item.revenue / data.totalRevenue * 100).toFixed(1)
                      return (
                        <div key={item.state} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 text-sm">{item.state}</p>
                              <p className="text-xs text-slate-500">{share}% share</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900 text-sm">₹{item.revenue.toLocaleString()}</p>
                            <p className="text-xs text-green-600">+{Math.floor(Math.random() * 15) + 5}%</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Chat */}
            <FloatingChat />
          </div>
        </main>
      </div>
    </div>
  )
}