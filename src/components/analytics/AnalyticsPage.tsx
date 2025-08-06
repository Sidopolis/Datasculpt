import React, { useState } from 'react'
import { DashboardHeader } from '../dashboard/DashboardHeader'
import { Sidebar } from '../dashboard/Sidebar'
import { ChartContainer } from '../charts/ChartContainer'
import { TrendingUp, Users, Package, DollarSign, BarChart3, Download } from 'lucide-react'
import { DataSculptAPI, downloadFile } from '../../lib/api'

interface AnalyticsData {
  revenueTrend: {
    id: string
    title: string
    type: 'line'
    data: Array<{ name: string; value: number }>
  }
  productPerformance: {
    id: string
    title: string
    type: 'bar'
    data: Array<{ name: string; value: number }>
  }
  customerSegments: {
    id: string
    title: string
    type: 'pie'
    data: Array<{ name: string; value: number }>
  }
  topMetrics: Array<{
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative'
    icon: React.ComponentType<{ className?: string }>
  }>
}

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const analyticsData: AnalyticsData = {
    revenueTrend: {
      id: 'revenue-trend',
      title: 'Revenue Trend (Last 6 Months)',
      type: 'line',
      data: [
        { name: 'Jan', value: 45000 },
        { name: 'Feb', value: 52000 },
        { name: 'Mar', value: 48000 },
        { name: 'Apr', value: 61000 },
        { name: 'May', value: 55000 },
        { name: 'Jun', value: 68000 }
      ]
    },
    productPerformance: {
      id: 'product-performance',
      title: 'Product Performance',
      type: 'bar',
      data: [
        { name: 'LUX Innerwear Premium', value: 134955 },
        { name: 'LUX Comfort Vest', value: 511968 },
        { name: 'LUX Cotton Briefs', value: 50372 },
        { name: 'LUX Sportswear', value: 124975 },
        { name: 'LUX Nightwear', value: 28578 }
      ]
    },
    customerSegments: {
      id: 'customer-segments',
      title: 'Customer Segments',
      type: 'pie',
      data: [
        { name: 'Premium', value: 45 },
        { name: 'Regular', value: 35 },
        { name: 'Budget', value: 20 }
      ]
    },
    topMetrics: [
      {
        title: 'Total Revenue',
        value: '₹680,000',
        change: '+15.2%',
        changeType: 'positive',
        icon: DollarSign
      },
      {
        title: 'Active Customers',
        value: '2,847',
        change: '+8.7%',
        changeType: 'positive',
        icon: Users
      },
      {
        title: 'Products Sold',
        value: '1,234',
        change: '+12.3%',
        changeType: 'positive',
        icon: Package
      },
      {
        title: 'Avg Order Value',
        value: '₹1,250',
        change: '+5.8%',
        changeType: 'positive',
        icon: TrendingUp
      }
    ]
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue Analysis', icon: TrendingUp },
    { id: 'products', label: 'Product Performance', icon: Package },
    { id: 'customers', label: 'Customer Insights', icon: Users }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.topMetrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">{metric.title}</p>
                      <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
                      <p className={`text-xs mt-1 ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <metric.icon className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
                <ChartContainer data={analyticsData.revenueTrend} />
                <button 
                  onClick={async () => {
                    try {
                      const csvBlob = await DataSculptAPI.exportAsCSV(analyticsData.revenueTrend)
                      downloadFile(csvBlob, 'revenue-trend.csv')
                    } catch (error) {
                      console.error('Download failed:', error)
                    }
                  }}
                  className="absolute top-2 right-2 p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <div className="relative">
                <ChartContainer data={analyticsData.productPerformance} />
                <button 
                  onClick={async () => {
                    try {
                      const csvBlob = await DataSculptAPI.exportAsCSV(analyticsData.productPerformance)
                      downloadFile(csvBlob, 'product-performance.csv')
                    } catch (error) {
                      console.error('Download failed:', error)
                    }
                  }}
                  className="absolute top-2 right-2 p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Customer Segments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative">
                <ChartContainer data={analyticsData.customerSegments} />
                <button 
                  onClick={async () => {
                    try {
                      const csvBlob = await DataSculptAPI.exportAsCSV(analyticsData.customerSegments)
                      downloadFile(csvBlob, 'customer-segments.csv')
                    } catch (error) {
                      console.error('Download failed:', error)
                    }
                  }}
                  className="absolute top-2 right-2 p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-slate-700">Revenue growth is consistent across all months</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-slate-700">Premium customers drive 45% of total revenue</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <p className="text-sm text-slate-700">LUX Comfort Vest is the top performing product</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'revenue':
        return (
          <div className="space-y-6">
            <div className="relative">
              <ChartContainer data={analyticsData.revenueTrend} />
              <button 
                onClick={async () => {
                  try {
                    const csvBlob = await DataSculptAPI.exportAsCSV(analyticsData.revenueTrend)
                    downloadFile(csvBlob, 'revenue-analysis.csv')
                  } catch (error) {
                    console.error('Download failed:', error)
                  }
                }}
                className="absolute top-2 right-2 p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Monthly Growth</h3>
                <p className="text-3xl font-bold text-green-600">+15.2%</p>
                <p className="text-sm text-slate-600 mt-1">vs last month</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Revenue Target</h3>
                <p className="text-3xl font-bold text-blue-600">85%</p>
                <p className="text-sm text-slate-600 mt-1">of annual goal</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Best Month</h3>
                <p className="text-3xl font-bold text-purple-600">June</p>
                <p className="text-sm text-slate-600 mt-1">₹68,000 revenue</p>
              </div>
            </div>
          </div>
        )

      case 'products':
        return (
          <div className="space-y-6">
            <div className="relative">
              <ChartContainer data={analyticsData.productPerformance} />
              <button 
                onClick={async () => {
                  try {
                    const csvBlob = await DataSculptAPI.exportAsCSV(analyticsData.productPerformance)
                    downloadFile(csvBlob, 'product-performance.csv')
                  } catch (error) {
                    console.error('Download failed:', error)
                  }
                }}
                className="absolute top-2 right-2 p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Analysis</h3>
              <div className="space-y-4">
                {analyticsData.productPerformance.data.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-600">₹{product.value.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-600">+{Math.floor(Math.random() * 20) + 10}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'customers':
        return (
          <div className="space-y-6">
            <div className="relative">
              <ChartContainer data={analyticsData.customerSegments} />
              <button 
                onClick={async () => {
                  try {
                    const csvBlob = await DataSculptAPI.exportAsCSV(analyticsData.customerSegments)
                    downloadFile(csvBlob, 'customer-insights.csv')
                  } catch (error) {
                    console.error('Download failed:', error)
                  }
                }}
                className="absolute top-2 right-2 p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Demographics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Age 25-35</span>
                    <span className="text-sm font-medium text-slate-900">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Age 36-45</span>
                    <span className="text-sm font-medium text-slate-900">32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Age 46+</span>
                    <span className="text-sm font-medium text-slate-900">23%</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Satisfaction</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Very Satisfied</span>
                    <span className="text-sm font-medium text-slate-900">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Satisfied</span>
                    <span className="text-sm font-medium text-slate-900">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Neutral</span>
                    <span className="text-sm font-medium text-slate-900">4%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">Analytics Dashboard</h1>
              <p className="text-slate-600">Comprehensive insights into your business performance</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="border-b border-slate-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 