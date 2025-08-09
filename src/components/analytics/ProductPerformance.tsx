import React from 'react'
import { MainLayout } from '../dashboard/MainLayout'
import { Package, TrendingUp, ArrowUpRight, ArrowDownRight, BarChart2 } from 'lucide-react'

export const ProductPerformance: React.FC = () => {
  const productData = {
    totalProducts: 20,
    topPerformers: [
      { name: 'Lux Lyra', sales: 1250, revenue: 1250000, growth: 15.2 },
      { name: 'Lux Cozy', sales: 980, revenue: 980000, growth: 8.7 },
      { name: 'Lux Venus', sales: 750, revenue: 750000, growth: 12.3 },
      { name: 'Lux Inferno', sales: 650, revenue: 650000, growth: -2.1 }
    ],
    categories: [
      { name: 'Premium', products: 5, share: 35 },
      { name: 'Standard', products: 8, share: 45 },
      { name: 'Economy', products: 7, share: 20 }
    ]
  }

  return (
    <MainLayout>
      <div>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Product Performance</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Monitor your product metrics and performance</p>
          </div>

          {/* Product Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total Products</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{productData.totalProducts}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Active Products</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Best Performer</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">Lux Lyra</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1 dark:text-green-300" />
                    <span className="text-xs text-green-600 dark:text-green-300">+15.2% Growth</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Category Split</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">3 Categories</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Premium, Standard, Economy</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Performance Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Performers */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top Performers</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Best selling products by revenue</p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {productData.topPerformers.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">{product.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900 dark:text-slate-100">₹{product.revenue.toLocaleString()}</p>
                        <div className="flex items-center justify-end">
                          {product.growth >= 0 ? (
                            <div className="flex items-center text-green-600 dark:text-green-300">
                              <ArrowUpRight className="w-4 h-4 mr-1 dark:text-green-300" />
                              <span className="text-sm dark:text-green-300">+{product.growth}%</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600 dark:text-red-300">
                              <ArrowDownRight className="w-4 h-4 mr-1 dark:text-red-300" />
                              <span className="text-sm dark:text-red-300">{product.growth}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Category Performance</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">Product distribution by category</p>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {productData.categories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{category.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{category.products} Products</p>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${category.share}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{category.share}% Market Share</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
    </MainLayout>
  )
}
