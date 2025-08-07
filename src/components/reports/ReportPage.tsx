import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Bot, User, Download, FileText, ArrowLeft, BarChart3, TrendingUp, Calendar } from 'lucide-react'
import { DataSculptAPI, BedrockResponse } from '../../lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'
import { Link } from 'react-router-dom'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  sqlQuery?: string
  timestamp: Date
  status?: 'pending' | 'success' | 'error'
  result?: Record<string, unknown>
  chartData?: Record<string, unknown>[]
  chartType?: 'bar' | 'line' | 'pie' | 'area'
}

interface ReportData {
  title: string
  description: string
  chartData: Record<string, unknown>[]
  chartType: 'bar' | 'line' | 'pie' | 'area'
  summary: string
  generatedAt: Date
}

export const ReportPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    setError(null)
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    try {
      // Generate SQL query using Bedrock API
      const bedrockResponse: BedrockResponse = await DataSculptAPI.generateSQLQuery(input)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I'll generate a report for: "${input}"`,
        sqlQuery: bedrockResponse.sqlQuery,
        timestamp: new Date(),
        status: 'pending'
      }
      setMessages(prev => [...prev, assistantMessage])
      // Execute the SQL query
      const result = await DataSculptAPI.verifyAndExecuteSQL(bedrockResponse.sqlQuery)
      // Generate chart data and report
      const chartData = transformDataToChart(result, input)
      const reportData: ReportData = {
        title: `Report: ${input}`,
        description: bedrockResponse.explanation,
        chartData: chartData.data,
        chartType: chartData.type,
        summary: generateSummary(result),
        generatedAt: new Date()
      }
      setCurrentReport(reportData)
      // Update the message with results
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessage.id
          ? {
              ...msg,
              status: 'success',
              result,
              chartData: chartData.data,
              chartType: chartData.type
            }
          : msg
      ))
    } catch (error: any) {
      console.error('Error processing query:', error)
      setError(error?.message || 'An error occurred while generating your report.')
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: 'I encountered an error while generating your report. Please try rephrasing your request.',
        timestamp: new Date(),
        status: 'error'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const transformDataToChart = (data: Record<string, unknown>, query: string): { data: Record<string, unknown>[], type: 'bar' | 'line' | 'pie' | 'area' } => {
    // Mock transformation - in real app, this would analyze the data structure
    const chartType = query.toLowerCase().includes('trend') ? 'line' : 
                     query.toLowerCase().includes('distribution') ? 'pie' : 'bar'
    
    // Transform data for chart
    const chartData = Array.isArray(data) ? data.map((item: Record<string, unknown>, index) => ({
      name: (item.name as string) || (item.state as string) || `Item ${index + 1}`,
      value: (item.value as number) || (item.revenue as number) || (item.count as number) || Math.random() * 1000
    })) : [
      { name: 'Sample 1', value: 450 },
      { name: 'Sample 2', value: 320 },
      { name: 'Sample 3', value: 280 },
      { name: 'Sample 4', value: 200 }
    ]

    return { data: chartData, type: chartType }
  }

  const generateSummary = (data: Record<string, unknown>): string => {
    const total = Array.isArray(data) ? data.length : 1
    const sum = Array.isArray(data) ? data.reduce((acc, item: Record<string, unknown>) => acc + ((item.value as number) || 0), 0) : 0
    
    return `Generated report with ${total} data points. Total value: ${sum.toLocaleString()}. Generated at ${new Date().toLocaleString()}.`
  }

  const handleDownloadReport = async (format: 'pdf' | 'csv') => {
    if (!currentReport) return

    try {
      let blob: Blob
      if (format === 'pdf') {
        blob = await DataSculptAPI.exportAsPDF({
          id: 'report',
          title: currentReport.title,
          type: currentReport.chartType,
          data: currentReport.chartData
        })
      } else {
        blob = await DataSculptAPI.exportAsCSV({
          id: 'report',
          title: currentReport.title,
          type: currentReport.chartType,
          data: currentReport.chartData
        })
      }
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${currentReport.title.toLowerCase().replace(/\s+/g, '_')}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(`Error downloading ${format}:`, error)
    }
  }

  const renderChart = (data: Record<string, unknown>[], type: string) => {
    const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316']

    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        )
      
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        )
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
          </AreaChart>
        )
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )
      
      default:
        return <div>Unsupported chart type</div>
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user'
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isUser 
            ? 'bg-slate-900 text-white' 
            : 'bg-white text-slate-900 border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700'
        }`}>
          <div className="flex items-start space-x-2">
            {message.type === 'assistant' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
            {message.type === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
            <div className="flex-1">
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              
              {message.chartData && message.chartType && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg dark:bg-slate-700">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      {renderChart(message.chartData, message.chartType)}
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-slate-300 dark:bg-slate-700"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Live Report Generator</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-300">AI-powered data analysis and visualization</p>
                </div>
              </div>
            </div>
            {currentReport && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleDownloadReport('pdf')}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => handleDownloadReport('csv')}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Assistant</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    Live
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {error && (
                  <div className="text-center text-red-500 bg-red-50 dark:bg-red-900 rounded p-4 mb-4">
                    <p className="font-semibold">{error}</p>
                  </div>
                )}
                {isLoading && !messages.length && (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-600 dark:border-slate-700 dark:border-t-slate-200 mx-auto mb-3"></div>
                    <span className="ml-2 text-slate-600 dark:text-slate-300">Loading...</span>
                  </div>
                )}
                {messages.length === 0 && !isLoading && !error && (
                  <div className="text-center text-slate-500 py-12">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Start Your Analysis</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Ask me to generate reports about your data</p>
                    <div className="space-y-2 text-xs text-slate-500">
                      <p>• "Show revenue by state"</p>
                      <p>• "Generate trend analysis"</p>
                      <p>• "Top performing products"</p>
                      <p>• "Monthly sales distribution"</p>
                    </div>
                  </div>
                )}
                
                {messages.map(renderMessage)}
                
                {isLoading && messages.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-white text-slate-900 max-w-xs lg:max-w-md px-4 py-3 rounded-lg border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-slate-600">Generating report...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-700">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask for a report (e.g., 'Show revenue trends by month')"
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Report Preview */}
          <div className="space-y-6">
            {currentReport ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Current Report</h3>
                  <span className="text-xs text-slate-500">{currentReport.generatedAt.toLocaleTimeString()}</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">{currentReport.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{currentReport.description}</p>
                  </div>
                  <div className="h-48 bg-slate-50 rounded-lg p-4 dark:bg-slate-700">
                    <ResponsiveContainer width="100%" height="100%">
                      {renderChart(currentReport.chartData, currentReport.chartType)}
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <p>{currentReport.summary}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                <div className="text-center text-slate-500">
                  <TrendingUp className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">No Report Generated</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Start a conversation to generate your first report</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setInput('Show revenue by state')}
                  className="w-full text-left p-3 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  Revenue by State
                </button>
                <button 
                  onClick={() => setInput('Top performing products')}
                  className="w-full text-left p-3 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  Top Products
                </button>
                <button 
                  onClick={() => setInput('Monthly sales trend')}
                  className="w-full text-left p-3 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  Sales Trend
                </button>
                <button 
                  onClick={() => setInput('Customer distribution')}
                  className="w-full text-left p-3 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  Customer Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 