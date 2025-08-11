import React, { useState, useEffect, useRef } from 'react'
import { Bell, Search, Menu, User, Settings, LogOut, ChevronDown, BarChart3, FileText, Database, PieChart, Sun, Moon, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'
import { useTheme } from '../../contexts/ThemeContext';
import { DataSculptAPI } from '../../lib/api';
import { dataSourceManager } from '../../lib/dataSources';

export const DashboardHeader: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [currentDatabase, setCurrentDatabase] = useState<'postgresql' | 'mysql'>('postgresql')
  const navigate = useNavigate()
  const { signOut } = useClerk()
  const { user } = useUser()
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsProfileOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const searchItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Data Management', path: '/data-management', icon: Database },
    { name: 'Revenue Charts', path: '/dashboard', icon: PieChart },
    { name: 'Sales Overview', path: '/dashboard', icon: BarChart3 },
  ]

  const filteredItems = searchItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowSearchResults(e.target.value.length > 0)
  }

  const searchRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const databaseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize from data source manager first, then localStorage
    const activeSource = dataSourceManager.getActiveSource()
    if (activeSource) {
      setCurrentDatabase(activeSource.type)
      DataSculptAPI.setDatabaseType(activeSource.type)
    } else {
      // Fallback to localStorage
      const saved = (localStorage.getItem('datasculpt-db') as 'postgresql' | 'mysql' | null)
      if (saved) {
        setCurrentDatabase(saved)
        DataSculptAPI.setDatabaseType(saved)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
      // Close database dropdown when clicking outside
      if (databaseRef.current && !databaseRef.current.contains(event.target as Node)) {
        setIsDatabaseOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearchItemClick = (path: string) => {
    navigate(path)
    setSearchQuery('')
    setShowSearchResults(false)
  }

  const handleProfileClick = () => {
    navigate('/settings')
    setIsProfileOpen(false)
  }

  const handleSettingsClick = () => {
    navigate('/settings')
    setIsProfileOpen(false)
  }

  const handleDatabaseChange = (database: 'postgresql' | 'mysql') => {
    setCurrentDatabase(database)
    localStorage.setItem('datasculpt-db', database)
    DataSculptAPI.setDatabaseType(database)
    setIsDatabaseOpen(false)
  }

  const handleDataSourceChange = (sourceId: string) => {
    const success = dataSourceManager.setActiveSource(sourceId)
    if (success) {
      const source = dataSourceManager.getActiveSource()
      if (source) {
        setCurrentDatabase(source.type)
        DataSculptAPI.setDatabaseType(source.type)
      }
    }
    setIsDatabaseOpen(false)
  }

  // Live notifications data
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'New data available',
      message: 'Your daily sales report is ready for review.',
      time: '2 minutes ago',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      type: 'success',
      title: 'Export completed',
      message: 'Revenue report has been exported successfully.',
      time: '1 hour ago',
      color: 'bg-green-500'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Low inventory alert',
      message: 'LUX Comfort Vest stock is running low.',
      time: '3 hours ago',
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      type: 'info',
      title: 'New user registered',
      message: 'A new admin account has been created.',
      time: '5 hours ago',
      color: 'bg-blue-500'
    }
  ]

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Search */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LUX</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">LUX Industries</h1>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="hidden md:flex relative">
            <div className="flex items-center space-x-2 bg-slate-100 rounded-md px-3 py-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search analytics, reports..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-500 w-64"
              />
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && filteredItems.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                <div className="py-2">
                  {filteredItems.map((item, index) => {
                    const IconComponent = item.icon
                    return (
                      <button
                        key={index}
                        onClick={() => handleSearchItemClick(item.path)}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                      >
                        <IconComponent className="w-4 h-4 text-slate-500" />
                        <span>{item.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Notifications, Theme Toggle, and Profile */}
        <div className="flex items-center space-x-3">
          {/* Database Selector */}
          <div ref={databaseRef} className="relative">
            <button
              data-database-selector
              onClick={() => setIsDatabaseOpen(!isDatabaseOpen)}
              className="flex items-center space-x-2 px-3 py-2 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-200"
            >
              <Database className="w-4 h-4 text-slate-600 dark:text-slate-200" />
              <span className="text-sm font-medium">
                {dataSourceManager.getActiveSource()?.name || currentDatabase}
              </span>
              {isDatabaseOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Database Dropdown */}
            {isDatabaseOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Data Sources</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Select your active database</p>
                </div>
                <div className="py-2 max-h-64 overflow-y-auto">
                  {dataSourceManager.getSources().length > 0 ? (
                    dataSourceManager.getSources().map((source) => (
                      <button
                        key={source.id}
                        onClick={() => handleDataSourceChange(source.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200 ${
                          source.isActive
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Database className="w-4 h-4" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{source.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {source.type.toUpperCase()} • {source.host}:{source.port}
                          </div>
                        </div>
                        {source.isActive && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      No data sources configured
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => {
                      setIsDatabaseOpen(false)
                      navigate('/data-management')
                    }}
                    className="w-full text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-center"
                  >
                    Manage Data Sources
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-200 relative"
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-200" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                  <p className="text-xs text-slate-500">{notifications.length} new notifications</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 hover:bg-slate-50 border-b border-slate-100 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 ${notification.color} rounded-full mt-2`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                          <p className="text-xs text-slate-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-slate-100">
                  <button className="w-full text-xs text-slate-600 hover:text-slate-900 text-center">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-yellow-400 hover:text-slate-900 dark:hover:text-yellow-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user?.firstName || user?.username}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-300">Admin</p>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {user?.firstName || user?.username}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{user?.emailAddresses?.[0]?.emailAddress || 'demo@datasculpt.com'}</p>
                </div>
                <div className="py-2">
                  <button 
                    onClick={handleProfileClick}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button 
                    onClick={handleSettingsClick}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors duration-200">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
} 