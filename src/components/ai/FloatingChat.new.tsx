import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Plus, Move, User, Bot, ChevronRight, ChevronLeft, Save } from 'lucide-react'
import { callBedrockFloatingChat, BedrockFloatingChatResponse } from '../../lib/bedrockFloatingChat'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface SavedChat {
  id: string
  title: string
  preview: string
  date: Date
  messages: Message[]
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your LUX Industries business assistant. How can I help you with product information, business guidance, or customer support today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatMode, setChatMode] = useState<'chat' | 'saved'>('chat')
  const [savedChats, setSavedChats] = useState<SavedChat[]>(() => {
    const saved = localStorage.getItem('floatingChatSaved')
    return saved ? JSON.parse(saved) : []
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const [chatSize, setChatSize] = useState({ width: 380, height: 550 })
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('floatingChatSaved', JSON.stringify(savedChats))
  }, [savedChats])

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
      content: input,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const bedrockResponse: BedrockFloatingChatResponse = await callBedrockFloatingChat(input)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: bedrockResponse.message,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error calling Bedrock:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveChat = () => {
    if (messages.length <= 1) return
    
    const newChat: SavedChat = {
      id: Date.now().toString(),
      title: messages.find(m => m.isUser)?.content.substring(0, 25) + '...' || 'New Chat',
      preview: messages[messages.length - 1].content.substring(0, 40) + '...',
      date: new Date(),
      messages: [...messages]
    }
    
    setSavedChats(prev => [newChat, ...prev])
    setMessages([{
      id: '1',
      content: "Hello! I'm your LUX Industries business assistant. How can I help you with product information, business guidance, or customer support today?",
      isUser: false,
      timestamp: new Date()
    }])
  }

  const handleLoadChat = (chatId: string) => {
    const chat = savedChats.find(c => c.id === chatId)
    if (chat) {
      setMessages(chat.messages)
      setChatMode('chat')
    }
  }

  const handleDeleteSavedChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSavedChats(prev => prev.filter(c => c.id !== chatId))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = chatSize.width
    const startHeight = chatSize.height

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      
      setChatSize({
        width: Math.max(300, Math.min(600, startWidth + deltaX)),
        height: Math.max(400, Math.min(700, startHeight + deltaY))
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const rect = chatRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y
    
    if (chatRef.current) {
      chatRef.current.style.left = `${Math.max(0, Math.min(window.innerWidth - chatSize.width, newX))}px`
      chatRef.current.style.top = `${Math.max(0, Math.min(window.innerHeight - chatSize.height, newY))}px`
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)
    }
  }, [isDragging, dragOffset])

  const renderMessage = (message: Message) => {
    const formattedContent = message.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')

    return (
      <div
        key={message.id}
        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!message.isUser && (
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2 mt-1">
            <Bot size={16} className="text-blue-600 dark:text-blue-300" />
          </div>
        )}
        <div
          className={`max-w-[75%] rounded-lg px-4 py-3 shadow-sm ${
            message.isUser
              ? 'bg-blue-500 text-white dark:bg-blue-600'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
          }`}
        >
          <div 
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
          <div className={`text-xs mt-1 ${
            message.isUser 
              ? 'text-blue-100 dark:text-blue-200' 
              : 'text-slate-500 dark:text-slate-400'
          }`}>
            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
        {message.isUser && (
          <div className="h-8 w-8 rounded-full bg-blue-500 dark:bg-blue-700 flex items-center justify-center ml-2 mt-1">
            <User size={16} className="text-white" />
          </div>
        )}
      </div>
    )
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 relative"
          aria-label="Open AI Assistant"
        >
          <MessageSquare size={24} />
          <div className="absolute top-0 right-0 -mt-1 -mr-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900"></div>
          <span className="absolute inset-0 rounded-full bg-blue-400 dark:bg-blue-500 animate-ping opacity-75"></span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        ref={chatRef}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-sm"
        style={{
          width: chatSize.width,
          height: chatSize.height,
          minWidth: 300,
          minHeight: 400,
          maxWidth: 600,
          maxHeight: 700,
          cursor: isResizing ? 'nw-resize' : 'default'
        }}
      >
        {/* Header with Drag Handle */}
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 text-white px-4 py-3 flex items-center justify-between cursor-move"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center space-x-2">
            <Move size={16} className="text-blue-200 dark:text-blue-300" />
            <div className="flex items-center justify-center bg-white dark:bg-slate-700 p-1 rounded-full">
              <Bot size={16} className="text-blue-600 dark:text-blue-300" />
            </div>
            <span className="font-semibold">LUX AI Assistant</span>
          </div>
          <div className="flex items-center">
            <div className="flex space-x-1 mr-2">
              <button
                onClick={() => setChatMode('chat')}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  chatMode === 'chat' 
                    ? 'bg-white/20 text-white' 
                    : 'hover:bg-white/10 text-white/80'
                }`}
              >
                <MessageSquare size={14} />
              </button>
              <button
                onClick={() => setChatMode('saved')}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  chatMode === 'saved' 
                    ? 'bg-white/20 text-white' 
                    : 'hover:bg-white/10 text-white/80'
                }`}
              >
                <Save size={14} />
              </button>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-slate-200 transition-colors hover:bg-blue-600 dark:hover:bg-blue-900 rounded-full p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {chatMode === 'chat' ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 h-[calc(100%-120px)] custom-scrollbar">
              <div className="space-y-4">
                {messages.map(renderMessage)}
                
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                      <Bot size={16} className="text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="animate-pulse flex space-x-1">
                          <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                          <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full delay-75"></div>
                          <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full delay-150"></div>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveChat}
                    disabled={messages.length <= 1}
                    className="text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 disabled:opacity-50 disabled:hover:text-slate-500 dark:disabled:hover:text-slate-400 transition-colors bg-white dark:bg-slate-700 p-2 rounded-full border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm"
                    title="Save conversation"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => setInput('Tell me about LUX Industries products')}
                    className="text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors bg-white dark:bg-slate-700 p-2 rounded-full border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm"
                    title="Quick question"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about LUX Industries..."
                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 text-white rounded-lg p-2.5 transition-colors shadow-sm flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-[calc(100%-56px)] overflow-auto p-4">
            {savedChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <Save size={40} className="mb-2 opacity-30" />
                <p>No saved conversations yet</p>
                <button 
                  onClick={() => setChatMode('chat')}
                  className="mt-4 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg text-sm flex items-center"
                >
                  <MessageSquare size={14} className="mr-1" />
                  Back to Chat
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Saved Conversations</h3>
                {savedChats.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => handleLoadChat(chat.id)}
                    className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 text-sm">{chat.title}</h4>
                      <button
                        onClick={(e) => handleDeleteSavedChat(chat.id, e)}
                        className="p-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{chat.preview}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(chat.date).toLocaleDateString()}
                      </span>
                      <button className="text-xs text-blue-500 dark:text-blue-400 flex items-center">
                        Open <ChevronRight size={12} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-5 h-5 cursor-nw-resize bg-slate-300 dark:bg-slate-600 hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors rounded-tl-md"
          onMouseDown={handleResizeStart}
        />
      </div>
    </div>
  )
}
