import React, { useState } from 'react'
import { DashboardHeader } from '../dashboard/DashboardHeader'
import { Sidebar } from '../dashboard/Sidebar'
import { ArrowLeft, Download, Send, Bot, Plus, Search, Settings, MessageSquare, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DataSculptAPI, downloadFile } from '../../lib/api'
import { DataChart } from '../charts/DataChart'
import { useUser } from '@clerk/clerk-react'

interface Report {
  id: string
  title: string
  type: string
  status: 'generating' | 'completed' | 'error'
  createdAt: Date
  data?: Array<Record<string, unknown>>
  sqlQuery?: string
  explanation?: string
  visualization?: string
}

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const handleGenerateReport = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    
    try {
      console.log('Generating SQL query for:', prompt)
      
      // Generate SQL query using Amazon Nova Pro
      const sqlResponse = await DataSculptAPI.generateSQLQuery(prompt)
      console.log('SQL Response:', sqlResponse)
      
      // Execute the SQL query
      const queryResult = await DataSculptAPI.verifyAndExecuteSQL(sqlResponse.sqlQuery)
      console.log('Query Result:', queryResult)
      
      // Create report with real data
      const newReport: Report = {
        id: Date.now().toString(),
        title: prompt,
        type: 'Custom',
        status: 'completed',
        createdAt: new Date(),
        data: Array.isArray(queryResult.data) ? queryResult.data : [],
        sqlQuery: sqlResponse.sqlQuery,
        explanation: sqlResponse.explanation,
        visualization: sqlResponse.suggestedVisualization
      }
      
      console.log('Created report:', newReport)
      setReports(prev => [newReport, ...prev])
      setSelectedReport(newReport)
      setPrompt('')
    } catch (error) {
      console.error('Error generating report:', error)
      // Add error report
      const errorReport: Report = {
        id: Date.now().toString(),
        title: prompt,
        type: 'Error',
        status: 'error',
        createdAt: new Date()
      }
      setReports(prev => [errorReport, ...prev])
      setSelectedReport(errorReport)
    } finally {
      setIsGenerating(false)
    }
  }

  const quickActions = [
    { title: 'Sales by Brand', prompt: 'Show total sales by brand' },
    { title: 'Top Products', prompt: 'Show top 5 products by total sales amount' },
    { title: 'Monthly Sales', prompt: 'Show monthly sales trend for the last 6 months' },
    { title: 'Category Sales', prompt: 'Show sales by category' }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">AI Analytics Chat</h1>
                <p className="text-slate-600 dark:text-slate-300">Ask questions about your data and get instant insights</p>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex bg-white dark:bg-slate-900">
            {/* Left Sidebar - Chat History */}
            <div className="w-80 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
              {/* Top Actions */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => {
                      // TODO: Implement search functionality
                      alert('Search functionality coming soon!')
                    }}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setReports([])
                    setSelectedReport(null)
                    setPrompt('')
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Chat</span>
                </button>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">Recent</h3>
                <div className="space-y-2">
                  {reports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedReport?.id === report.id 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-700' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <MessageSquare className={`w-4 h-4 ${selectedReport?.id === report.id ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                        <span className="text-sm truncate">
                          {report.title.length > 30 ? report.title.substring(0, 30) + '...' : report.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {reports.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Bot className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      Hello, {user?.firstName || user?.username || 'User'}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">Ask me anything about your data</p>
                    
                    <div className="mt-8 max-w-lg mx-auto grid grid-cols-2 gap-3">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => setPrompt(action.prompt)}
                          className="p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left text-sm text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                        >
                          <p className="font-medium mb-1">{action.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{action.prompt}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div key={report.id} className="space-y-4">
                      {/* User Message */}
                      <div className="flex items-start space-x-3">
                        <div className="w-9 h-9 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-sm font-medium text-white">{user?.firstName?.[0] || 'U'}</span>
                        </div>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none px-5 py-3">
                          <p className="text-slate-900 dark:text-white">{report.title}</p>
                        </div>
                      </div>

                      {/* AI Response */}
                      <div className="flex items-start space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 space-y-4">
                          {report.status === 'completed' && report.explanation && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none shadow-sm px-5 py-3 border border-slate-100 dark:border-slate-700">
                              <p className="text-slate-700 dark:text-slate-200">{report.explanation}</p>
                            </div>
                          )}
                          {report.status === 'error' && (
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl rounded-tl-none border border-red-100 dark:border-red-900/30 px-5 py-3">
                              <p className="text-red-700 dark:text-red-300">Sorry, I couldn't generate that report. Please try rephrasing your question.</p>
                            </div>
                          )}

                          {/* Data Visualization */}
                          {report.status === 'completed' && report.data && report.data.length > 0 && (
                            <div className="space-y-4">
                              {/* Chart Visualization */}
                              {report.visualization && report.visualization !== 'table' && (
                                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-slate-900 dark:text-white">Chart Visualization</h4>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full capitalize">
                                      {report.visualization} chart
                                    </span>
                                  </div>
                                  <DataChart 
                                    data={report.data}
                                    type={report.visualization as 'bar' | 'line' | 'pie' | 'area'}
                                    title={report.title}
                                  />
                                </div>
                              )}
                              
                              {/* Data Table */}
                              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-medium text-slate-900 dark:text-white">Data Table</h4>
                                  <button 
                                    onClick={async () => {
                                      try {
                                        const csvBlob = await DataSculptAPI.exportAsCSV({
                                          id: report.id,
                                          title: report.title,
                                          type: (report.visualization as 'bar' | 'line' | 'pie' | 'area') || 'bar',
                                          data: report.data || []
                                        })
                                        downloadFile(csvBlob, `${report.title}.csv`)
                                      } catch (error) {
                                        console.error('Download failed:', error)
                                      }
                                    }}
                                    className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b border-slate-200 dark:border-slate-700">
                                        {report.data[0] && Object.keys(report.data[0]).map((key) => (
                                          <th key={key} className="text-left py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {report.data.slice(0, 5).map((row, index) => (
                                        <tr key={index} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                          {Object.values(row).map((value, cellIndex) => (
                                            <td key={cellIndex} className="py-2 px-3 text-slate-600 dark:text-slate-400">
                                              {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  {report.data.length > 5 && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Showing first 5 rows of {report.data.length} total results</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SQL Query (for debugging) */}
                          {report.status === 'completed' && report.sqlQuery && (
                            <details className="mt-4">
                              <summary className="text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                                View SQL Query
                              </summary>
                              <pre className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-700 dark:text-slate-300 overflow-x-auto border border-slate-200 dark:border-slate-700">
                                {report.sqlQuery}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Loading State */}
                {isGenerating && (
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none px-5 py-4 border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-slate-700 dark:text-slate-300">Analyzing your data...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask me anything about your data (e.g., 'Show me the best month where sales of particular items are high')"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white bg-white dark:bg-slate-700 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleGenerateReport()}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          const suggestions = [
                            'Show total sales by brand',
                            'Show monthly revenue trend',
                            'Show top 10 products by revenue',
                            'Show customer demographics',
                            'Show inventory status'
                          ]
                          const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
                          setPrompt(randomSuggestion)
                        }}
                        className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        title="Get a random query suggestion"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const examples = [
                            'What are our best performing products this month?',
                            'Show me sales trends over the last 6 months',
                            'Which brands generate the most revenue?',
                            'Compare sales performance by category',
                            'What is our average order value by region?'
                          ]
                          const randomExample = examples[Math.floor(Math.random() * examples.length)]
                          setPrompt(randomExample)
                        }}
                        className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        title="Get a natural language example"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating || !prompt.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-96 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Report Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Auto-save Reports
                </label>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                    Automatically save generated reports
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Default Chart Type
                </label>
                <select className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="area">Area Chart</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Max Results per Query
                </label>
                <input 
                  type="number" 
                  defaultValue={100}
                  min="10"
                  max="1000"
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 