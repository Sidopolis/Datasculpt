import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Plus, Move } from 'lucide-react'
import { callBedrockFloatingChat, BedrockFloatingChatResponse } from '../../lib/bedrockFloatingChat'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const [chatSize, setChatSize] = useState({ width: 400, height: 600 })
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

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
        width: Math.max(300, Math.min(800, startWidth + deltaX)),
        height: Math.max(400, Math.min(800, startHeight + deltaY))
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
        <div
          className={`max-w-[80%] rounded-lg px-4 py-2 ${
            message.isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
          <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
        >
          <MessageSquare size={24} />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        ref={chatRef}
        className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
        style={{
          width: chatSize.width,
          height: chatSize.height,
          minWidth: 300,
          minHeight: 400,
          maxWidth: 800,
          maxHeight: 800,
          cursor: isResizing ? 'nw-resize' : 'default'
        }}
      >
        {/* Header with Drag Handle */}
        <div 
          className="bg-blue-500 text-white px-4 py-3 flex items-center justify-between cursor-move"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center space-x-2">
            <Move size={16} className="text-blue-200" />
            <MessageSquare size={20} />
            <span className="font-semibold">LUX Industries Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 h-[calc(100%-120px)]">
          {messages.map(renderMessage)}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setInput('Tell me about LUX Industries products')}
              className="text-gray-500 hover:text-blue-500 transition-colors"
              title="Quick question"
            >
              <Plus size={16} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about LUX Industries..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg p-2 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Powered by AWS Bedrock Claude
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-gray-300 hover:bg-gray-400 transition-colors"
          onMouseDown={handleResizeStart}
        />
      </div>
    </div>
  )
} 