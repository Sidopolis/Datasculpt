import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Code, Play, AlertCircle, CheckCircle, PlusCircle, BookmarkIcon, MessageSquareIcon, X } from 'lucide-react'
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

interface ChatSession {
  id: string
  name: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
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
  const [activeTab, setActiveTab] = useState<'new' | 'saved'>('new')
  const [savedChats, setSavedChats] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('savedChatSessions')
    return saved ? JSON.parse(saved) : []
  })
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  // Save chat sessions to localStorage
  useEffect(() => {
    localStorage.setItem('savedChatSessions', JSON.stringify(savedChats))
  }, [savedChats])

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
    setActiveTab('new')
    setActiveChatId(null)
  }

  const handleSaveChat = () => {
    if (messages.length <= 1) return
    
    const chatName = messages.find(m => m.type === 'user')?.content.substring(0, 30) + '...' || 'New Chat'
    const newChat: ChatSession = {
      id: Date.now().toString(),
      name: chatName,
      messages: [...messages],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setSavedChats(prev => [newChat, ...prev])
    handleNewChat()
  }

  const handleLoadChat = (chatId: string) => {
    const chat = savedChats.find(c => c.id === chatId)
    if (chat) {
      setMessages(chat.messages)
      setActiveChatId(chatId)
      setActiveTab('saved')
      setIsSidebarOpen(false)
    }
  }

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSavedChats(prev => prev.filter(c => c.id !== chatId))
    if (activeChatId === chatId) {
      handleNewChat()
    }
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
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        {!isUser && (
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2 mt-1">
            <Bot size={16} className="text-blue-600 dark:text-blue-300" />
          </div>
        )}
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-sm ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white' 
            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
        }`}>
          <div className="flex items-start space-x-2">
            <div className="flex-1">
              <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
              
              {message.sqlQuery && (
                <div className="mt-3 p-3 bg-slate-800 dark:bg-slate-900 rounded-lg text-xs font-mono text-green-400 dark:text-green-300 overflow-x-auto border border-slate-700 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Code className="w-3 h-3 mr-1" />
                      <span className="text-slate-400 dark:text-slate-300">SQL Query:</span>
                    </div>
                    {message.status === 'pending' && (
                      <button
                        onClick={() => handleExecuteQuery(message.id, message.sqlQuery!)}
                        disabled={isExecuting}
                        className="flex items-center space-x-1 px-2 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded text-xs hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        <span>Execute</span>
                      </button>
                    )}
                    {message.status === 'success' && (
                      <div className="flex items-center text-green-400 dark:text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        <span className="text-xs">Executed</span>
                      </div>
                    )}
                    {message.status === 'error' && (
                      <div className="flex items-center text-red-400 dark:text-red-300">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        <span className="text-xs">Error</span>
                      </div>
                    )}
                  </div>
                  <div className="custom-scrollbar">
                    <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-40">{message.sqlQuery}</pre>
                  </div>
                </div>
              )}

              {message.result && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">Query Results</span>
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300 overflow-auto max-h-40 custom-scrollbar">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(message.result, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {isUser && (
          <div className="h-8 w-8 rounded-full bg-blue-500 dark:bg-blue-700 flex items-center justify-center ml-2 mt-1">
            <User size={16} className="text-white" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      {/* Chat navigation sidebar - slides in from left */}
      <div 
        className={`fixed md:relative z-10 top-0 left-0 h-full w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-800 dark:text-slate-200">Chat History</h3>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'new' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-center">
              <MessageSquareIcon size={14} className="mr-1" />
              New Chat
            </div>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'saved' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-center">
              <BookmarkIcon size={14} className="mr-1" />
              Saved
            </div>
          </button>
        </div>
        
        <div className="p-2 overflow-y-auto" style={{ maxHeight: 'calc(100% - 105px)' }}>
          {activeTab === 'saved' && savedChats.length === 0 && (
            <div className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
              No saved chats yet
            </div>
          )}
          
          {activeTab === 'saved' && savedChats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => handleLoadChat(chat.id)}
              className={`p-2 rounded-lg mb-1 cursor-pointer flex items-center justify-between ${
                activeChatId === chat.id 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center overflow-hidden">
                <MessageSquareIcon size={14} className="min-w-[14px] mr-2" />
                <span className="text-sm truncate">{chat.name}</span>
              </div>
              <button
                onClick={(e) => handleDeleteChat(chat.id, e)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden mr-2 p-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white"
            >
              <MessageSquareIcon size={16} />
            </button>
            <div className="flex items-center justify-center bg-white/10 dark:bg-white/20 backdrop-blur-sm p-1.5 rounded-full mr-2">
              <Bot size={16} className="text-white" />
            </div>
            <h3 className="text-base font-semibold text-white">AI Data Assistant</h3>
            <span className="ml-2 px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full font-medium">
              Powered by Bedrock
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveChat}
              className="px-2 py-1 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center"
              disabled={messages.length <= 1}
            >
              <BookmarkIcon size={14} className="mr-1" />
              Save
            </button>
            <button
              onClick={handleNewChat}
              className="px-2 py-1 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center"
            >
              <PlusCircle size={14} className="mr-1" />
              New Chat
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-4">
            {messages.map(renderMessage)}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                  <Bot size={16} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div className="bg-white dark:bg-slate-800 max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                      <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">Processing your request...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your data..."
              className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 