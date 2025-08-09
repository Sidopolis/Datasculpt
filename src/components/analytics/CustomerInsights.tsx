import React from 'react'
import { MainLayout } from '../dashboard/MainLayout'
import { Users, Activity, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export const CustomerInsights: React.FC = () => {
  const customerData = {
    totalCustomers: 12580,
    activeCustomers: 8940,
    newCustomers: 245,
    retention: 92.5,
    segments: [
      { name: 'Premium', customers: 2516, spending: 1250000, growth: 15.2 },
      { name: 'Regular', customers: 5024, spending: 750000, growth: 8.7 },
      { name: 'Occasional', customers: 5040, spending: 250000, growth: 3.4 }
    ],
    behavior: [
      { metric: 'Average Purchase Frequency', value: '2.8 orders/month' },
      { metric: 'Average Order Value', value: '₹1,738' },
      { metric: 'Customer Lifetime Value', value: '₹15,420' }
    ],
    churnRate: 3.5,
    lifetimeValue: '₹15,420'
  }

  return (
    <MainLayout>
      <div>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Customer Insights</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Analyze customer behavior and segments</p>
          </div>

          {/* Customer Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Customers</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{customerData.totalCustomers.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600 dark:text-green-400">+12.5% Growth</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Active Customers</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{customerData.activeCustomers.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600 dark:text-green-400">+8.7% Active</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Churn Rate</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{customerData.churnRate}%</p>
                  <div className="flex items-center mt-1">
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-xs text-red-600 dark:text-red-400">-2.3% Churn</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-red-50 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-600 dark:text-red-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Customer Lifetime Value</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{customerData.lifetimeValue}</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Segments and Behavior */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Customer Segments */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Customer Segments</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Distribution by customer type</p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {customerData.segments.map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{segment.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{segment.customers.toLocaleString()} customers</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900 dark:text-slate-100">₹{segment.spending.toLocaleString()}</p>
                          <div className="flex items-center justify-end">
                            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-xs text-green-600 dark:text-green-400">+{segment.growth}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(segment.customers / customerData.totalCustomers) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Behavior */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Customer Behavior</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Key customer metrics</p>
              </div>
              <div className="p-4">
                <div className="space-y-6">
                  {customerData.behavior.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{item.metric}</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-1">{item.value}</p>
                      </div>
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        {index === 0 && <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-300" />}
                        {index === 1 && <Activity className="w-6 h-6 text-green-600 dark:text-green-300" />}
                        {index === 2 && <Users className="w-6 h-6 text-purple-600 dark:text-purple-300" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
    </MainLayout>
  )
}
