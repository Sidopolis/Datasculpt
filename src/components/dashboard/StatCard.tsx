import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon 
}) => {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{title}</p>
          <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${changeColors[changeType]} dark:${changeType === 'positive' ? 'text-green-400' : changeType === 'negative' ? 'text-red-400' : 'text-slate-400'}`}> 
              {change}
            </p>
          )}
        </div>
        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </div>
      </div>
    </div>
  )
}