import React from 'react'
import { Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  totalSales: number
  revenue: number
}

interface TopProductsProps {
  products: Product[]
}

export const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <Package className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
      </div>
      
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 mr-3">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.totalSales} units sold</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}