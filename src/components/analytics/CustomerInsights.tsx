import React from 'react'
import { DashboardHeader } from '../dashboard/DashboardHeader'
import { Sidebar } from '../dashboard/Sidebar'
import { Users, TrendingUp, Activity, ShoppingBag, ArrowUpRight } from 'lucide-react'

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
    ]
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Customer Insights</h1>
            <p className="text-sm text-slate-600">Analyze customer behavior and segments</p>
          </div>

          {/* Customer Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Customers</p>
                  <p className="text-xl font-semibold text-slate-900">{customerData.totalCustomers.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+12.5% Growth</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Customers</p>
                  <p className="text-xl font-semibold text-slate-900">{customerData.activeCustomers.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-slate-600">{Math.round((customerData.activeCustomers / customerData.totalCustomers) * 100)}% of total</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">New Customers</p>
                  <p className="text-xl font-semibold text-slate-900">{customerData.newCustomers}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-slate-600">This month</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Retention Rate</p>
                  <p className="text-xl font-semibold text-slate-900">{customerData.retention}%</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+2.1%</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Segments and Behavior */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Customer Segments */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Customer Segments</h3>
                <p className="text-sm text-slate-600">Distribution by customer type</p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {customerData.segments.map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{segment.name}</p>
                          <p className="text-sm text-slate-600">{segment.customers.toLocaleString()} customers</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900">₹{segment.spending.toLocaleString()}</p>
                          <div className="flex items-center justify-end">
                            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-xs text-green-600">+{segment.growth}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
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
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Customer Behavior</h3>
                <p className="text-sm text-slate-600">Key customer metrics</p>
              </div>
              <div className="p-4">
                <div className="space-y-6">
                  {customerData.behavior.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">{item.metric}</p>
                        <p className="text-lg font-semibold text-slate-900 mt-1">{item.value}</p>
                      </div>
                      <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center">
                        {index === 0 && <ShoppingBag className="w-6 h-6 text-blue-600" />}
                        {index === 1 && <Activity className="w-6 h-6 text-green-600" />}
                        {index === 2 && <Users className="w-6 h-6 text-purple-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
