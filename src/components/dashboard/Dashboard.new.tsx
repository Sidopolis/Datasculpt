import React, { useState, useEffect } from 'react'
import { DashboardHeader } from './DashboardHeader'
import { Sidebar } from './Sidebar'
import { StatCard } from './StatCard'
import { ChartContainer } from '../charts/ChartContainer'
import FloatingChat from '../ai/FloatingChat.new'
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
    
    try {
      const apiData = await DataSculptAPI.getDashboardData()
      setData(apiData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="max-w-md text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Error Loading Dashboard</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Dashboard</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard 
                title="Total Revenue" 
                value={`$${data.totalRevenue.toLocaleString()}`} 
                change={data.revenueChange} 
                icon={TrendingUp} 
                trend={data.revenueChange >= 0 ? 'up' : 'down'} 
              />
              <StatCard 
                title="Products" 
                value={data.totalProducts.toLocaleString()} 
                change={data.productsChange} 
                icon={Package} 
                trend={data.productsChange >= 0 ? 'up' : 'down'} 
              />
              <StatCard 
                title="Orders" 
                value={data.totalOrders.toLocaleString()} 
                change={data.ordersChange} 
                icon={ShoppingCart} 
                trend={data.ordersChange >= 0 ? 'up' : 'down'} 
              />
              <StatCard 
                title="Customers" 
                value={data.totalCustomers.toLocaleString()} 
                change={data.customersChange} 
                icon={Users} 
                trend={data.customersChange >= 0 ? 'up' : 'down'} 
              />
            </div>
            
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartContainer 
                title="Revenue Over Time" 
                subtitle="Monthly revenue for the current year"
                data={data.revenueByMonth}
                type="line"
                xKey="month"
                yKey="revenue"
                height={300}
              />
              <ChartContainer 
                title="Top Products" 
                subtitle="Products by revenue"
                data={data.topProducts}
                type="bar"
                xKey="name"
                yKey="revenue"
                height={300}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer 
                title="Sales by Category" 
                subtitle="Revenue distribution by product category"
                data={data.salesByCategory}
                type="pie"
                xKey="category"
                yKey="value"
                height={300}
              />
              <ChartContainer 
                title="Customer Acquisition" 
                subtitle="New customers over time"
                data={data.customerAcquisition}
                type="area"
                xKey="month"
                yKey="customers"
                height={300}
              />
            </div>
          </div>
        </main>
      </div>
      
      {/* Floating Chat */}
      <FloatingChat />
    </div>
  )
}
