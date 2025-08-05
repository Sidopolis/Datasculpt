import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'

interface AuthContextType {
  user: any
  session: any
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded: userLoaded } = useUser()
  const { session, isLoaded: sessionLoaded } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userLoaded && sessionLoaded) {
      setLoading(false)
    }
  }, [userLoaded, sessionLoaded])

  const signIn = async (email: string, password: string) => {
    try {
      // This will be handled by Clerk's sign-in component
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // This will be handled by Clerk's sign-up component
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      // This will be handled by Clerk's sign-out component
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}