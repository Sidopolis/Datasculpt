import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react'
import { Dashboard } from './components/dashboard/Dashboard'
import { ReportsPage } from './components/reports/ReportsPage'
import { RevenueAnalysis } from './components/analytics/RevenueAnalysis'
import { ProductPerformance } from './components/analytics/ProductPerformance'
import { CustomerInsights } from './components/analytics/CustomerInsights'
import { DataManagementPage } from './components/data/DataManagementPage'
import { SettingsPage } from './components/settings/SettingsPage'
import { LandingPage } from './components/landing/LandingPage'

// Get your Clerk publishable key from environment variables
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder_key_for_development'

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/sign-in/*"
            element={
              <SignedOut>
                <SignIn routing="path" path="/sign-in" />
              </SignedOut>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <SignedOut>
                <SignUp routing="path" path="/sign-up" />
              </SignedOut>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            }
          />
          <Route
            path="/reports"
            element={
              <SignedIn>
                <ReportsPage />
              </SignedIn>
            }
          />
          <Route
            path="/analytics/revenue"
            element={
              <SignedIn>
                <RevenueAnalysis />
              </SignedIn>
            }
          />
          <Route
            path="/analytics/products"
            element={
              <SignedIn>
                <ProductPerformance />
              </SignedIn>
            }
          />
          <Route
            path="/analytics/customers"
            element={
              <SignedIn>
                <CustomerInsights />
              </SignedIn>
            }
          />
          <Route
            path="/data-management"
            element={
              <SignedIn>
                <DataManagementPage />
              </SignedIn>
            }
          />
          <Route
            path="/settings"
            element={
              <SignedIn>
                <SettingsPage />
              </SignedIn>
            }
          />

          {/* Root route - Landing page for unauthenticated, redirect to dashboard for authenticated */}
          <Route
            path="/"
            element={
              <>
                <SignedOut>
                  <LandingPage />
                </SignedOut>
                <SignedIn>
                  <Navigate to="/dashboard" />
                </SignedIn>
              </>
            }
          />

          {/* Catch-all route */}
          <Route
            path="*"
            element={
              <SignedOut>
                <Navigate to="/" />
              </SignedOut>
            }
          />
        </Routes>
      </Router>
    </ClerkProvider>
  )
}

export default App