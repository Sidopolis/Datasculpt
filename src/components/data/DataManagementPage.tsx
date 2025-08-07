import React, { useState } from 'react'
import { DashboardHeader } from '../dashboard/DashboardHeader'
import { Sidebar } from '../dashboard/Sidebar'
import { Database, Upload, Download, RefreshCw, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface DataSource {
  id: string
  name: string
  type: 'database' | 'api' | 'file'
  status: 'connected' | 'disconnected' | 'error'
  lastSync: string
  records: number
}

interface DataQuality {
  metric: string
  value: number
  status: 'good' | 'warning' | 'error'
  description: string
}

export const DataManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const dataSources: DataSource[] = [
    {
      id: '1',
      name: 'PostgreSQL Database',
      type: 'database',
      status: 'connected',
      lastSync: '2 minutes ago',
      records: 15420
    },
    {
      id: '2',
      name: 'LUX API',
      type: 'api',
      status: 'connected',
      lastSync: '5 minutes ago',
      records: 8920
    },
    {
      id: '3',
      name: 'Customer CSV Import',
      type: 'file',
      status: 'connected',
      lastSync: '1 hour ago',
      records: 3240
    },
    {
      id: '4',
      name: 'Legacy System',
      type: 'database',
      status: 'error',
      lastSync: '2 hours ago',
      records: 0
    }
  ]

  const dataQuality: DataQuality[] = [
    {
      metric: 'Data Completeness',
      value: 98.5,
      status: 'good',
      description: '98.5% of required fields are populated'
    },
    {
      metric: 'Data Accuracy',
      value: 96.2,
      status: 'good',
      description: '96.2% of data passes validation rules'
    },
    {
      metric: 'Data Consistency',
      value: 89.7,
      status: 'warning',
      description: '89.7% of data is consistent across sources'
    },
    {
      metric: 'Data Freshness',
      value: 92.1,
      status: 'good',
      description: '92.1% of data is updated within 24 hours'
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Database },
    { id: 'sources', label: 'Data Sources', icon: Upload },
    { id: 'quality', label: 'Data Quality', icon: Shield },
    { id: 'operations', label: 'Operations', icon: RefreshCw }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-gray-400" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50'
      case 'disconnected':
        return 'text-gray-600 bg-gray-50'
      case 'error':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getQualityColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Data Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Total Records</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">27,580</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12.5% from last month</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Active Sources</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">3</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">1 source with issues</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Data Quality</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">94.1%</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Consistency needs attention</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Last Sync</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">2 min</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">All systems operational</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Data sync completed</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">PostgreSQL Database • 2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Upload className="w-4 h-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">New data imported</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">Customer CSV • 1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Connection failed</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">Legacy System • 2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'sources':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Data Sources</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Add Source
                </button>
              </div>
              <div className="space-y-4">
                {dataSources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(source.status)}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{source.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{source.records.toLocaleString()} records</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}>
                        {source.status}
                      </span>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Last sync: {source.lastSync}</p>
                      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'quality':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Data Quality Metrics</h3>
              <div className="space-y-4">
                {dataQuality.map((quality, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${quality.status === 'good' ? 'bg-green-500' : quality.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{quality.metric}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{quality.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-semibold ${getQualityColor(quality.status)}`}>
                        {quality.value}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Quality Issues</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Missing Customer Data</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">1,247 records affected</p>
                    </div>
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">High Priority</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Duplicate Records</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">89 records affected</p>
                    </div>
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Medium Priority</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Data Validation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Email Format</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Phone Numbers</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Address Format</span>
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Product Codes</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'operations':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Data Operations</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">Import Data</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">Upload CSV, Excel files</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">Export Data</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">Download reports, datasets</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">Sync All Sources</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">Update all data sources</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Scheduled Tasks</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Daily Data Sync</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">Every day at 2:00 AM</p>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Weekly Backup</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">Every Sunday at 1:00 AM</p>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">Monthly Cleanup</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">First day of month</p>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Paused</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-slate-900 dark:text-slate-100">Database</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Operational</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-slate-900 dark:text-slate-100">API Services</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Operational</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="font-medium text-slate-900 dark:text-slate-100">Legacy System</p>
                  <p className="text-sm text-red-600 dark:text-red-400">Offline</p>
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Data Management</h1>
              <p className="text-slate-600 dark:text-slate-300">Monitor and manage your data sources, quality, and operations</p>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
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