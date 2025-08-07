import React from 'react'
import { DashboardHeader } from '../dashboard/DashboardHeader'
import { Sidebar } from '../dashboard/Sidebar'
import { TrendingUp, DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { ChartContainer } from '../charts/ChartContainer'

export const RevenueAnalysis: React.FC = () => {
  const revenueData = {
    totalRevenue: 4794644.33,
    growth: 12.5,
    monthlyTarget: 5000000,
    averageOrderValue: 1738,
    topChannels: [
      { name: 'Direct Sales', revenue: 2156789.45, growth: 15.2 },
      { name: 'Online Store', revenue: 1845632.78, growth: 8.7 },
      { name: 'Distributors', revenue: 792222.10, growth: -2.3 }
    ]
  }

  const mockChartData = {
    id: 'revenue-trend',
    title: 'Revenue Trend',
    type: 'line',
    data: [] // This would be populated with actual data
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Revenue Analysis</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Track and analyze your revenue metrics</p>
          </div>

          {/* Revenue Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Revenue</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">₹{revenueData.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600 dark:text-green-400">+{revenueData.growth}%</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Monthly Target</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">₹5,000,000</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-xs text-blue-600 dark:text-blue-400">On Track</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Avg Order Value</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">₹1,738</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600 dark:text-green-400">+5.2%</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Revenue Target</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">95.8%</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600 dark:text-green-400">On Track</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <ChartContainer data={mockChartData} />
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Revenue by Channel</h3>
              <div className="space-y-4">
                {revenueData.topChannels.map((channel, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{channel.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">₹{channel.revenue.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center">
                      {channel.growth >= 0 ? (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                          <span className="text-sm">+{channel.growth}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 dark:text-red-400">
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                          <span className="text-sm">{channel.growth}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
