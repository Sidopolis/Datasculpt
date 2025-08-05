import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Bot, User, X, Minimize2 } from 'lucide-react'
import { DataSculptAPI, BedrockResponse } from '../../lib/api'

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  sqlQuery?: string
  timestamp: Date
  status?: 'pending' | 'success' | 'error'
  result?: Record<string, unknown>
}

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your LUX Industries AI assistant. Ask me about sales, products, or any data analysis.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
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
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: bedrockResponse.explanation,
        sqlQuery: bedrockResponse.sqlQuery,
        timestamp: new Date(),
        status: 'pending'
      }

      setMessages(prev => [...prev, assistantMessage])

      // Execute the SQL query
      const result = await DataSculptAPI.verifyAndExecuteSQL(bedrockResponse.sqlQuery)
      
      // Update the message with results
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, status: 'success', result }
          : msg
      ))

    } catch (error) {
      console.error('Error processing query:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: 'I encountered an error while processing your request. Please try rephrasing your question.',
        timestamp: new Date(),
        status: 'error'
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user'
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
          isUser 
            ? 'bg-red-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="flex items-start space-x-2">
            {message.type === 'assistant' && <Bot className="w-3 h-3 mt-0.5 flex-shrink-0" />}
            {message.type === 'user' && <User className="w-3 h-3 mt-0.5 flex-shrink-0" />}
            <div className="flex-1">
              <p className="whitespace-pre-line">{message.content}</p>
              
              {message.sqlQuery && (
                <div className="mt-2 p-2 bg-gray-800 rounded text-xs font-mono text-green-400 overflow-x-auto">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400">SQL Query:</span>
                    {message.status === 'success' && (
                      <span className="text-green-400 text-xs">✓ Executed</span>
                    )}
                    {message.status === 'error' && (
                      <span className="text-red-400 text-xs">✗ Error</span>
                    )}
                  </div>
                  <pre className="whitespace-pre-wrap text-xs">{message.sqlQuery}</pre>
                </div>
              )}

              {message.result && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <div className="flex items-center mb-1">
                    <span className="text-green-800 font-medium">Query Results</span>
                  </div>
                  <div className="text-green-700">
                    <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(message.result, null, 2)}</pre>
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
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 h-[500px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">LUX</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">AI Assistant</h3>
                  <p className="text-xs text-gray-500">Powered by Bedrock</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(renderMessage)}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 max-w-xs px-3 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-3 h-3" />
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-xs text-gray-600">Processing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about LUX data..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 