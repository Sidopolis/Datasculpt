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
  Home,
  MessageSquare,
  ShieldCheck,
  PieChart,
  Zap,
  Target,
  Globe,
  Calendar
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
      },
      {
        id: 'regional',
        label: 'Regional Analytics',
        icon: Globe,
        path: '/analytics/regional'
      },
      {
        id: 'forecasts',
        label: 'Sales Forecasts',
        icon: Target,
        path: '/analytics/forecasts'
      },
      {
        id: 'seasonal',
        label: 'Seasonal Trends',
        icon: Calendar,
        path: '/analytics/seasonal'
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
    id: 'aiChat',
    label: 'AI Assistant',
    icon: MessageSquare,
    path: '/ai-assistant',
    badge: 'Beta'
  },
  {
    id: 'data',
    label: 'Data Management',
    icon: Database,
    path: '/data-management',
    children: [
      {
        id: 'sources',
        label: 'Data Sources',
        icon: Database,
        path: '/data-management/sources'
      },
      {
        id: 'quality',
        label: 'Data Quality',
        icon: ShieldCheck,
        path: '/data-management/quality'
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: Zap,
        path: '/data-management/integrations'
      }
    ]
  },
  {
    id: 'visualizations',
    label: 'Visualizations',
    icon: PieChart,
    path: '/visualizations'
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
      <div key={item.id} className={`${level === 0 ? 'mb-1' : ''}`}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else {
              navigate(item.path)
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            active
              ? level === 0 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500 dark:border-blue-400'
              : 'text-gray-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
          } ${level > 0 ? 'ml-3 pl-4' : ''}`}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={`w-5 h-5 ${
              active 
                ? level === 0 ? 'text-white' : 'text-blue-500 dark:text-blue-400' 
                : 'text-gray-500 dark:text-slate-400'
            }`} />
            <span>{item.label}</span>
            {item.badge && (
              <span className={`ml-1.5 px-1.5 py-0.5 text-xs font-medium rounded-full ${
                item.badge === 'New' 
                  ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                  : item.badge === 'Beta'
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300' 
                    : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
              }`}>
                {item.badge}
              </span>
            )}
          </div>
          {hasChildren && (
            <ChevronRight 
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              } ${
                active
                  ? level === 0 ? 'text-white' : 'text-blue-500 dark:text-blue-400'
                  : 'text-gray-400 dark:text-slate-500'
              }`}
            />
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="mt-1 mb-1 space-y-1 border-l border-slate-200 dark:border-slate-700 ml-4 pl-2">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 h-screen">
      {/* Navigation */}
      <div className="h-full flex flex-col">
        <div className="p-3 flex-grow overflow-y-auto custom-scrollbar">
          <nav className="space-y-0.5">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>
        </div>
        
        {/* User Profile Section */}
        <div className="border-t border-gray-200 dark:border-slate-700 p-4 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
              H
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-white">Hrithik Singh</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Admin</p>
            </div>
            <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
} 