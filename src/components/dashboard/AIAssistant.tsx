import React, { useState } from 'react'
import { MessageSquare, Send, Bot, User, Code } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  sqlQuery?: string
  timestamp: Date
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I can help you query your data using natural language. Try asking something like "Show top products in Maharashtra" or "What is the total revenue by state?"',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock AI responses based on common queries
  const generateResponse = (query: string): { content: string; sqlQuery?: string } => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('top products') || lowerQuery.includes('best selling')) {
      return {
        content: 'Here are the top-selling products based on total sales volume. The query retrieves product names with their total quantities sold.',
        sqlQuery: `SELECT p.name, SUM(o.quantity) as total_sold, SUM(o.total_amount) as revenue
FROM products p
JOIN orders o ON p.id = o.product_id
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 10;`
      }
    }
    
    if (lowerQuery.includes('revenue by state') || lowerQuery.includes('state wise revenue')) {
      return {
        content: 'This query shows the total revenue generated from each state, ordered by highest revenue first.',
        sqlQuery: `SELECT state, SUM(total_amount) as revenue
FROM orders
GROUP BY state
ORDER BY revenue DESC;`
      }
    }
    
    if (lowerQuery.includes('maharashtra') || lowerQuery.includes('mumbai')) {
      return {
        content: 'Here\'s the data specifically for Maharashtra state, showing products and their performance.',
        sqlQuery: `SELECT p.name, SUM(o.quantity) as units_sold, SUM(o.total_amount) as revenue
FROM products p
JOIN orders o ON p.id = o.product_id
WHERE o.state = 'Maharashtra'
GROUP BY p.id, p.name
ORDER BY revenue DESC;`
      }
    }
    
    if (lowerQuery.includes('total revenue') || lowerQuery.includes('total sales')) {
      return {
        content: 'This query calculates the total revenue across all orders and states.',
        sqlQuery: `SELECT 
  SUM(total_amount) as total_revenue,
  COUNT(*) as total_orders,
  AVG(total_amount) as avg_order_value
FROM orders;`
      }
    }
    
    return {
      content: 'I can help you analyze your sales data. Try asking about:\n• Top selling products\n• Revenue by state\n• Product performance in specific states\n• Total sales metrics',
      sqlQuery: `-- Example: Get monthly revenue trend
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(total_amount) as monthly_revenue
FROM orders
GROUP BY month
ORDER BY month;`
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      const response = generateResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        sqlQuery: response.sqlQuery,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-96 flex flex-col">
      <div className="flex items-center mb-4">
        <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">AI Data Assistant</h3>
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Beta</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              <div className="flex items-start space-x-2">
                {message.type === 'assistant' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {message.type === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                <div>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  {message.sqlQuery && (
                    <div className="mt-2 p-2 bg-gray-800 rounded text-xs font-mono text-green-400 overflow-x-auto">
                      <div className="flex items-center mb-1">
                        <Code className="w-3 h-3 mr-1" />
                        <span className="text-gray-400">SQL Query:</span>
                      </div>
                      <pre className="whitespace-pre-wrap">{message.sqlQuery}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your data..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}