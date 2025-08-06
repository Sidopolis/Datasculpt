import React from 'react'
import { SignInButton } from '@clerk/clerk-react'

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">LUX</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">LUX Industries</span>
            </div>
            <SignInButton mode="modal">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              LUX Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Keep track of your sales, products, and business growth. 
              Everything you need to run LUX Industries better.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Sales & Revenue</h3>
              <p className="text-sm text-gray-600">
                Daily sales, top products, and which states are performing best.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Business Insights</h3>
              <p className="text-sm text-gray-600">
                Growth trends, inventory status, and customer behavior patterns.
              </p>
            </div>
          </div>

          <div className="text-center">
            <SignInButton mode="modal">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors">
                Get Started
              </button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xs">LUX</span>
            </div>
            <span className="text-sm text-gray-500">LUX Industries Dashboard</span>
          </div>
        </div>
      </footer>
    </div>
  )
} 