import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Bot, User, Code, Play, AlertCircle, CheckCircle } from 'lucide-react'
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

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages')
    return savedMessages ? JSON.parse(savedMessages) : [
      {
        id: '1',
        type: 'assistant',
        content: 'Hello! I\'m your AI data assistant. I can help you query your data using natural language. Try asking something like:\n\n• "Show top products in Maharashtra"\n• "What is the total revenue by state?"\n• "Which products are performing best?"\n• "Generate a revenue trend analysis"',
        timestamp: new Date()
      }
    ]
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight
    }
  }, [messages])

  const handleNewChat = () => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI data assistant. I can help you query your data using natural language. Try asking something like:\n\n• "Show top products in Maharashtra"\n• "What is the total revenue by state?"\n• "Which products are performing best?"\n• "Generate a revenue trend analysis"',
      timestamp: new Date()
    }])
  }

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
      setIsExecuting(true)
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
        content: 'I encountered an error while processing your request. Please try rephrasing your question or check your query syntax.',
        timestamp: new Date(),
        status: 'error'
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsExecuting(false)
    }
  }

  const handleExecuteQuery = async (messageId: string, sqlQuery: string) => {
    setIsExecuting(true)
    
    try {
      const result = await DataSculptAPI.verifyAndExecuteSQL(sqlQuery)
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'success', result }
          : msg
      ))
    } catch (error) {
      console.error('Error executing query:', error)
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: 'error' }
          : msg
      ))
    } finally {
      setIsExecuting(false)
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
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
            : 'bg-gray-50 text-gray-900 border border-gray-200'
        }`}>
          <div className="flex items-start space-x-2">
            {message.type === 'assistant' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
            {message.type === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
            <div className="flex-1">
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              
              {message.sqlQuery && (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg text-xs font-mono text-green-400 overflow-x-auto">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Code className="w-3 h-3 mr-1" />
                      <span className="text-gray-400">SQL Query:</span>
                    </div>
                    {message.status === 'pending' && (
                      <button
                        onClick={() => handleExecuteQuery(message.id, message.sqlQuery!)}
                        disabled={isExecuting}
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Play className="w-3 h-3" />
                        <span>Execute</span>
                      </button>
                    )}
                    {message.status === 'success' && (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        <span className="text-xs">Executed</span>
                      </div>
                    )}
                    {message.status === 'error' && (
                      <div className="flex items-center text-red-400">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        <span className="text-xs">Error</span>
                      </div>
                    )}
                  </div>
                  <pre className="whitespace-pre-wrap text-xs">{message.sqlQuery}</pre>
                </div>
              )}

              {message.result && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Query Results</span>
                  </div>
                  <div className="text-xs text-green-700">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(message.result, null, 2)}</pre>
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center">
          <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI Data Assistant</h3>
          <span className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs rounded-full font-medium">
            Powered by Bedrock
          </span>
        </div>
        <button
          onClick={handleNewChat}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(renderMessage)}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 text-gray-900 max-w-xs lg:max-w-md px-4 py-3 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-600">Processing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your data..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 