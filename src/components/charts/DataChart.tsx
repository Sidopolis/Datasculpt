import React from 'react'

interface DataChartProps {
  data: Array<Record<string, unknown>>
  type: 'bar' | 'line' | 'pie' | 'area'
  title?: string
}

export const DataChart: React.FC<DataChartProps> = ({ data, type, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-8 text-center">
        <p className="text-slate-500">No data available for visualization</p>
      </div>
    )
  }

  // Extract chart data
  const chartData = data.map((row) => {
    const keys = Object.keys(row)
    // Use the value of the first key as the label
    let displayName = String(row[keys[0]])
    const value = Number(row[keys[1]] || row[keys[0]] || 0)
    // Format month names if the data contains month information
    if (displayName.includes('-') && displayName.match(/^\d{4}-\d{2}$/)) {
      // Convert YYYY-MM to readable month name
      const [year, month] = displayName.split('-')
      const date = new Date(parseInt(year), parseInt(month) - 1)
      displayName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }
    return { name: displayName, value }
  })

  const maxValue = Math.max(...chartData.map(d => d.value))
  const total = chartData.reduce((sum, d) => sum + d.value, 0)

  const renderBarChart = () => (
    <div className="space-y-3">
      {chartData.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
                     <div className="w-24 text-sm text-slate-600 truncate">
             {item.name}
           </div>
                     <div className="flex-1 bg-slate-200 rounded-full h-6 relative">
            <div 
              className="bg-blue-500 h-6 rounded-full transition-all duration-300"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
              {item.value.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  )

  const renderLineChart = () => (
    <div className="relative h-48">
      <svg className="w-full h-full" viewBox="0 0 400 200">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line
            key={y}
            x1="0"
            y1={y * 2}
            x2="400"
            y2={y * 2}
            stroke="#E2E8F0"
            strokeWidth="1"
          />
        ))}
        
        {/* Line path */}
        <path
          d={chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * 400
            const y = 200 - ((point.value / maxValue) * 200)
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
          }).join(' ')}
          stroke="#3B82F6"
          strokeWidth="3"
          fill="none"
        />
        
        {/* Area fill */}
        <path
          d={chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * 400
            const y = 200 - ((point.value / maxValue) * 200)
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
          }).join(' ') + ` L 400 200 L 0 200 Z`}
          fill="url(#lineGradient)"
        />
        
        {/* Data points */}
        {chartData.map((point, index) => {
          const x = (index / (chartData.length - 1)) * 400
          const y = 200 - ((point.value / maxValue) * 200)
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#3B82F6"
              stroke="white"
              strokeWidth="2"
            />
          )
        })}
      </svg>
      
      {/* X-axis labels */}
             <div className="flex justify-between mt-2 text-xs text-slate-500">
        {chartData.map((item, index) => (
          <span key={index} className="truncate max-w-16">
            {item.name}
          </span>
        ))}
      </div>
    </div>
  )

  const renderPieChart = () => (
    <div className="flex items-center space-x-6">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
                     {chartData.map((item, index) => {
             const startAngle = chartData
               .slice(0, index)
               .reduce((sum, d) => sum + (d.value / total) * 360, 0)
             const endAngle = startAngle + (item.value / total) * 360
            
            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
            const color = colors[index % colors.length]
            
            const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180)
            const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180)
            const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180)
            const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180)
            
            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
            
            return (
              <path
                key={index}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={color}
              />
            )
          })}
        </svg>
      </div>
      
      <div className="space-y-2">
        {chartData.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1)
          const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
          const color = colors[index % colors.length]
          
          return (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
                             <span className="text-sm text-slate-600">{item.name}</span>
               <span className="text-sm font-medium text-slate-900">
                 {percentage}%
               </span>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart()
      case 'line':
        return renderLineChart()
      case 'pie':
        return renderPieChart()
      case 'area':
        return renderLineChart() // Area chart same as line for now
      default:
        return renderBarChart()
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200">
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      )}
      {renderChart()}
    </div>
  )
} 