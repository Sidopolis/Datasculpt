import React, { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  Settings, 
  FileText, 
  Database,
  ChevronRight,
  Home
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  badge?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    children: [
      {
        id: 'revenue',
        label: 'Revenue Analysis',
        icon: TrendingUp,
        path: '/analytics/revenue'
      },
      {
        id: 'products',
        label: 'Product Performance',
        icon: Package,
        path: '/analytics/products'
      },
      {
        id: 'customers',
        label: 'Customer Insights',
        icon: Users,
        path: '/analytics/customers'
      }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    path: '/reports',
    badge: 'New'
  },
  {
    id: 'data',
    label: 'Data Management',
    icon: Database,
    path: '/data-management'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings'
  }
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard'])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id)
    const hasChildren = item.children && item.children.length > 0
    const active = isActive(item.path)

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else {
              navigate(item.path)
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            active
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          } ${level > 0 ? 'ml-4' : ''}`}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500'}`} />
            <span>{item.label}</span>
            {item.badge && (
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          {hasChildren && (
            <ChevronRight 
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              }`} 
            />
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-1">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>


    </aside>
  )
} 