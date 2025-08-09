import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Save, Bookmark, Trash, Plus, FileText, ChevronLeft, ChevronRight, X, Download, Database } from 'lucide-react';
import { DataSculptAPI, BedrockResponse } from '../../lib/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sqlQuery?: string;
  timestamp: Date;
  status?: 'pending' | 'success' | 'error';
  result?: any;
}

interface SavedChat {
  id: string;
  title: string;
  preview: string;
  date: Date;
  messages: ChatMessage[];
}

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your SQL data assistant. Ask me to analyze your data, and I'll help you write SQL queries and explain the results.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'saved'>('chat');
  const [savedChats, setSavedChats] = useState<SavedChat[]>(() => {
    const saved = localStorage.getItem('aiAssistantSavedChats');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSidebar, setShowSidebar] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('aiAssistantSavedChats', JSON.stringify(savedChats));
  }, [savedChats]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle click outside sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSidebar && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSidebar]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Generate SQL query using Bedrock API
      const bedrockResponse: BedrockResponse = await DataSculptAPI.generateSQLQuery(input);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'll analyze that for you. Here's a SQL query I've created:`,
        sqlQuery: bedrockResponse.sqlQuery,
        timestamp: new Date(),
        status: 'pending'
      };

      setMessages([...newMessages, assistantMessage]);

      // Execute the SQL query
      const result = await DataSculptAPI.verifyAndExecuteSQL(bedrockResponse.sqlQuery);
      
      // Update the message with results
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id
          ? {
              ...msg,
              content: bedrockResponse.explanation,
              status: 'success',
              result
            }
          : msg
      ));
    } catch (error) {
      console.error('Error generating SQL:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble analyzing that. Could you try rephrasing your question or asking something else?",
        timestamp: new Date(),
        status: 'error'
      };

      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChat = () => {
    if (messages.length <= 1) return;
    
    const newChat: SavedChat = {
      id: Date.now().toString(),
      title: messages.find(m => m.role === 'user')?.content.substring(0, 25) + '...' || 'New Chat',
      preview: messages[messages.length - 1].content.substring(0, 40) + '...',
      date: new Date(),
      messages: [...messages]
    };
    
    setSavedChats(prev => [newChat, ...prev]);
  };

  const handleLoadChat = (chatId: string) => {
    const chat = savedChats.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setActiveView('chat');
      setShowSidebar(false);
    }
  };

  const handleDeleteSavedChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedChats(prev => prev.filter(c => c.id !== chatId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your SQL data assistant. Ask me to analyze your data, and I'll help you write SQL queries and explain the results.",
        timestamp: new Date()
      }
    ]);
    setActiveView('chat');
    setShowSidebar(false);
  };

  const renderMessage = (message: ChatMessage) => {
    return (
      <div
        key={message.id}
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {message.role === 'assistant' && (
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
            <Bot size={16} className="text-blue-600 dark:text-blue-300" />
          </div>
        )}
        
        <div className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
          message.role === 'user'
            ? 'bg-blue-500 text-white dark:bg-blue-600'
            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
        }`}>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {message.content}
          </div>
          
          {message.sqlQuery && (
            <div className="mt-3 bg-slate-100 dark:bg-slate-700 rounded-md p-2 overflow-x-auto">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">SQL Query:</span>
                {message.status === 'success' && (
                  <span className="text-xs text-green-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Executed
                  </span>
                )}
              </div>
              <pre className="text-xs text-slate-800 dark:text-slate-200 overflow-x-auto p-1 font-mono">
                {message.sqlQuery}
              </pre>
            </div>
          )}
          
          {message.result && message.status === 'success' && (
            <div className="mt-3 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 flex justify-between items-center">
                <span>Query Results</span>
                <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                  <Download size={14} />
                </button>
              </div>
              <div className="p-2 overflow-x-auto max-h-60 overflow-y-auto custom-scrollbar">
                {Array.isArray(message.result) && message.result.length > 0 ? (
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-xs">
                    <thead>
                      <tr>
                        {Object.keys(message.result[0]).map(key => (
                          <th key={key} className="px-2 py-1 text-left font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {message.result.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700/30'}>
                          {Object.values(row).map((cell, cellIdx) => (
                            <td key={cellIdx} className="px-2 py-1 whitespace-nowrap text-slate-800 dark:text-slate-200">
                              {String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-sm text-slate-600 dark:text-slate-300 p-2">
                    {Array.isArray(message.result) && message.result.length === 0 
                      ? "No results found for this query." 
                      : "Result received but not in expected format."}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-1 text-xs text-right opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
        
        {message.role === 'user' && (
          <div className="h-8 w-8 rounded-full bg-blue-500 dark:bg-blue-700 flex items-center justify-center ml-2">
            <User size={16} className="text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative h-full flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label={showSidebar ? "Hide sidebar" : "Show sidebar"}
            >
              {showSidebar ? <ChevronLeft size={18} /> : <Database size={18} />}
            </button>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">SQL Data Assistant</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSaveChat}
              disabled={messages.length <= 1}
              className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
              title="Save conversation"
            >
              <Save size={18} />
            </button>
            <button
              onClick={handleNewChat}
              className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="New conversation"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div 
          ref={sidebarRef}
          className={`absolute inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-10 transform transition-transform duration-200 ease-in-out ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Saved Queries</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              </div>
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center py-2 px-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
              >
                <Plus size={16} className="mr-1" />
                New Query
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {savedChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-500 dark:text-slate-400">
                  <FileText size={24} className="mb-2 opacity-30" />
                  <p className="text-sm">No saved queries yet</p>
                </div>
              ) : (
                savedChats.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => handleLoadChat(chat.id)}
                    className="p-2 border border-slate-200 dark:border-slate-700 rounded-md cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{chat.title}</h4>
                      <button
                        onClick={(e) => handleDeleteSavedChat(chat.id, e)}
                        className="p-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{chat.preview}</p>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {new Date(chat.date).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages container */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 custom-scrollbar"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Database size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">
                  SQL Data Assistant
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                  Ask questions about your data in plain English and I'll generate SQL queries to find the answers you need.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                  <button 
                    onClick={() => setInput('Show me total sales by region for the last quarter')}
                    className="p-3 text-left border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    "Show me total sales by region for the last quarter"
                  </button>
                  <button 
                    onClick={() => setInput('Who are our top 5 customers by revenue?')}
                    className="p-3 text-left border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    "Who are our top 5 customers by revenue?"
                  </button>
                  <button 
                    onClick={() => setInput('What products have the highest profit margin?')}
                    className="p-3 text-left border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    "What products have the highest profit margin?"
                  </button>
                  <button 
                    onClick={() => setInput('Compare monthly sales between this year and last year')}
                    className="p-3 text-left border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    "Compare monthly sales between this year and last year"
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(renderMessage)}
                
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                      <Bot size={16} className="text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg px-4 py-3 shadow-sm border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-2">
                        <div className="animate-pulse flex space-x-1">
                          <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                          <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-delay-100"></div>
                          <div className="h-2 w-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-delay-200"></div>
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {messages.length <= 1 ? 'Thinking...' : 'Generating SQL query...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask a question about your data..."
                  rows={1}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                  style={{ minHeight: '52px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="self-end px-4 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
