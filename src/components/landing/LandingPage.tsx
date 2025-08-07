
import React from 'react'
import { SignInButton } from '@clerk/clerk-react'



export const LandingPage: React.FC = () => {
  return (
    <div className="h-screen min-h-0 relative flex flex-col overflow-hidden">
      {/* Animated SVG Pattern Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="luxPattern" patternUnits="userSpaceOnUse" width="80" height="80">
              <rect x="0" y="0" width="80" height="80" fill="#fff" />
              <circle cx="40" cy="40" r="36" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.08" />
              <circle cx="40" cy="40" r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.10" />
              <rect x="10" y="10" width="60" height="60" rx="16" fill="none" stroke="#e11d48" strokeWidth="1.2" opacity="0.07" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#luxPattern)" />
        </svg>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white/80 to-slate-100 animate-gradient-move" style={{mixBlendMode:'multiply', opacity:0.95}} />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-pink-500 rounded-xl flex items-center justify-center shadow">
                <span className="text-white font-extrabold text-lg tracking-widest">LUX</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">LUX Industries</span>
            </div>
            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white px-6 py-2 rounded-lg text-base font-semibold shadow transition-all duration-200">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}

      <section className="flex-1 flex flex-col items-center justify-center px-2 sm:px-8 lg:px-0 min-h-0 relative z-10">
        <div className="max-w-4xl w-full mx-auto text-center flex flex-col justify-center h-full">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight drop-shadow-sm">
            Transform Your Business<br />
            <span className="bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">with LUX Dashboard</span>
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Deep analytics, actionable insights, and a beautiful interface to help you grow, optimize, and lead your industry. <br />
            Trusted by leaders with a rich legacy and a vision for the future.
          </p>


          {/* Floating Legacy Wall - Animated Newspaper Articles */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-t-4 border-red-500 hover:scale-105 transition-transform duration-200">
              <h3 className="font-bold text-base text-red-600 mb-2 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" /></svg>
                Sales & Revenue
              </h3>
              <p className="text-gray-600 text-sm">
                Track daily sales, top products, and discover which states are driving your success.
              </p>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-t-4 border-pink-500 hover:scale-105 transition-transform duration-200">
              <h3 className="font-bold text-base text-pink-600 mb-2 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                Business Insights
              </h3>
              <p className="text-gray-600 text-sm">
                Uncover growth trends, monitor inventory, and understand customer behavior patterns.
              </p>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500 hover:scale-105 transition-transform duration-200">
              <h3 className="font-bold text-base text-indigo-600 mb-2 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2" /></svg>
                Legacy & Trust
              </h3>
              <p className="text-gray-600 text-sm">
                Built for organizations with deep history and a commitment to excellence.
              </p>
            </div>
          </div>

          <SignInButton mode="modal">
            <button className="bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white px-8 py-3 rounded-xl text-xl font-bold shadow-lg transition-all duration-200">
              Get Started
            </button>
          </SignInButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/90 border-t border-gray-200 py-4 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-red-600 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">LUX</span>
              </div>
              <span className="text-base text-gray-700 font-semibold">LUX Industries Dashboard</span>
            </div>
            <div className="text-xs text-gray-400">&copy; {new Date().getFullYear()} LUX Industries. All rights reserved.</div>
          </div>
        </div>
      </footer>
      {/* Animated gradient keyframes and floating legacy wall style */}
      <style>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 12s ease-in-out infinite;
        }
        .newspaper-clip {
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.07), 0 1.5px 0 0 #fbbf24;
          border-radius: 0.75rem 0.75rem 0.5rem 0.5rem/1.2rem 1.2rem 0.5rem 0.5rem;
          border-left: 3px dashed #fbbf24;
          font-family: 'Georgia', serif;
        }
        @keyframes float1 {
          0% { transform: translateY(0) rotate(-2deg) scale(1); }
          20% { transform: translateY(-18px) rotate(2deg) scale(1.04); }
          40% { transform: translateY(10px) rotate(-1deg) scale(1.01); }
          60% { transform: translateY(-12px) rotate(1deg) scale(1.03); }
          80% { transform: translateY(8px) rotate(-2deg) scale(1.02); }
          100% { transform: translateY(0) rotate(-2deg) scale(1); }
        }
        @keyframes float2 {
          0% { transform: translateY(0) rotate(1deg) scale(1); }
          25% { transform: translateY(-22px) rotate(-2deg) scale(1.03); }
          50% { transform: translateY(12px) rotate(2deg) scale(1.01); }
          75% { transform: translateY(-10px) rotate(-1deg) scale(1.04); }
          100% { transform: translateY(0) rotate(1deg) scale(1); }
        }
        @keyframes float3 {
          0% { transform: translateY(0) rotate(2deg) scale(1); }
          30% { transform: translateY(-16px) rotate(-1deg) scale(1.02); }
          60% { transform: translateY(14px) rotate(1deg) scale(1.03); }
          100% { transform: translateY(0) rotate(2deg) scale(1); }
        }
        @keyframes float4 {
          0% { transform: translateY(0) rotate(-1deg) scale(1); }
          20% { transform: translateY(-20px) rotate(2deg) scale(1.04); }
          50% { transform: translateY(10px) rotate(-2deg) scale(1.01); }
          80% { transform: translateY(-14px) rotate(1deg) scale(1.03); }
          100% { transform: translateY(0) rotate(-1deg) scale(1); }
        }
        @keyframes float5 {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          25% { transform: translateY(-14px) rotate(1deg) scale(1.02); }
          50% { transform: translateY(8px) rotate(-1deg) scale(1.01); }
          75% { transform: translateY(-8px) rotate(2deg) scale(1.03); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }
      `}</style>
    </div>
  )
}