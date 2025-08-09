import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  BarChart3, 
  TrendingUp, 
  PieChart,
  Calendar,
  Download,
  Trash,
  Clock,
  ChevronRight,
  AlertCircle,
  AreaChart
} from 'lucide-react'
import { MainLayout } from '../dashboard/MainLayout.new'

// Mock types
interface Report {
  id: string
  title: string
  description: string
  type: 'bar' | 'line' | 'pie' | 'area'
  createdAt: Date
  status: 'completed' | 'generating' | 'error'
  previewImageUrl?: string
}

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  
  // Mock data loading
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReports([
        {
          id: '1',
          title: 'Monthly Revenue Analysis',
          description: 'Breakdown of revenue streams by month with year-over-year comparison',
          type: 'line',
          createdAt: new Date('2023-11-12'),
          status: 'completed',
          previewImageUrl: '/preview-1.png'
        },
        {
          id: '2',
          title: 'Product Performance Q3',
          description: 'Analysis of top-performing products in the third quarter',
          type: 'bar',
          createdAt: new Date('2023-11-10'),
          status: 'completed',
          previewImageUrl: '/preview-2.png'
        },
        {
          id: '3',
          title: 'Customer Demographics',
          description: 'Distribution of customers by age, location, and spending habits',
          type: 'pie',
          createdAt: new Date('2023-11-05'),
          status: 'completed',
          previewImageUrl: '/preview-3.png'
        },
        {
          id: '4',
          title: 'Regional Sales Trend',
          description: 'Sales growth trends across different geographic regions',
          type: 'area',
          createdAt: new Date('2023-11-01'),
          status: 'completed',
          previewImageUrl: '/preview-4.png'
        },
        {
          id: '5',
          title: 'Marketing Campaign ROI',
          description: 'Calculating the return on investment for recent marketing campaigns',
          type: 'bar',
          createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          status: 'generating',
        },
        {
          id: '6',
          title: 'Supply Chain Analysis',
          description: 'Analysis of supply chain efficiency and bottlenecks',
          type: 'line',
          createdAt: new Date('2023-10-28'),
          status: 'error',
        }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleDeleteReport = (reportId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setReports(prev => prev.filter(report => report.id !== reportId))
  }

  const filteredReports = reports
    .filter(report => {
      if (activeFilter === 'all') return true
      if (activeFilter === 'generating' && report.status === 'generating') return true
      if (activeFilter === 'completed' && report.status === 'completed') return true
      if (activeFilter === 'error' && report.status === 'error') return true
      if (activeFilter === 'recent' && (new Date().getTime() - new Date(report.createdAt).getTime()) < 1000 * 60 * 60 * 24 * 7) return true
      return false
    })
    .filter(report => {
      if (!searchQuery) return true
      return report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             report.description.toLowerCase().includes(searchQuery.toLowerCase())
    })

  const getReportIcon = (type: 'bar' | 'line' | 'pie' | 'area') => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="text-blue-500" />
      case 'line':
        return <TrendingUp className="text-green-500" />
      case 'pie':
        return <PieChart className="text-purple-500" />
      case 'area':
        return <AreaChart className="text-amber-500" />
    }
  }

  const getStatusBadge = (status: 'completed' | 'generating' | 'error') => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">Completed</span>
      case 'generating':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 flex items-center">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-1"></span>
            Generating
          </span>
        )
      case 'error':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">Failed</span>
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Reports</h1>
            <p className="text-slate-500 dark:text-slate-400">Create and manage your analytical reports</p>
          </div>
          <button
            onClick={() => navigate('/report/new')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span>New Report</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <button className="flex items-center space-x-2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                <Filter size={16} className="text-slate-400" />
                <span>Filter</span>
              </button>
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-10 w-36">
                {/* Filter dropdown would go here */}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex space-x-6 overflow-x-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All Reports
            </button>
            <button
              onClick={() => setActiveFilter('recent')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeFilter === 'recent'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveFilter('generating')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeFilter === 'generating'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Generating
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeFilter === 'completed'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveFilter('error')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeFilter === 'error'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Failed
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">No reports found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
              {searchQuery 
                ? `No reports matching "${searchQuery}" were found. Try a different search term.`
                : 'You haven\'t created any reports yet. Create your first report to get started.'}
            </p>
            <button
              onClick={() => navigate('/report/new')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
              <span>Create New Report</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(report => (
              <Link
                key={report.id}
                to={`/report/${report.id}`}
                className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {report.previewImageUrl ? (
                  <div className="h-48 bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {getReportIcon(report.type)}
                    </div>
                    {/* If we had actual images: */}
                    {/* <img src={report.previewImageUrl} alt={report.title} className="w-full h-full object-cover" /> */}
                  </div>
                ) : (
                  <div className="h-48 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    {report.status === 'generating' ? (
                      <div className="flex flex-col items-center text-blue-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                        <span className="text-sm">Generating report...</span>
                      </div>
                    ) : report.status === 'error' ? (
                      <div className="flex flex-col items-center text-red-500">
                        <AlertCircle size={32} className="mb-2" />
                        <span className="text-sm">Generation failed</span>
                      </div>
                    ) : (
                      getReportIcon(report.type)
                    )}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {report.title}
                    </h3>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => handleDeleteReport(report.id, e)}
                        className="p-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                    {report.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <Calendar size={14} className="mr-1" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      {getStatusBadge(report.status)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* New Report Card */}
            <div 
              onClick={() => navigate('/report/new')} 
              className="bg-white dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 overflow-hidden cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors h-full flex flex-col items-center justify-center p-6"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <Plus size={24} className="text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Create New Report</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                Generate reports with AI by asking questions about your data
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
