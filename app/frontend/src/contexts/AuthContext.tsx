import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiClient } from '../lib/api'

interface User {
  id: string
  email: string
}

interface Session {
  access_token: string
}

interface UserProfile {
  id: string
  user_id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session and fetch profile
    const token = localStorage.getItem('auth_token')
    if (token) {
      setSession({ access_token: token })
      fetchProfile()
    }
    setLoading(false)
  }, [])

  const fetchProfile = async () => {
    try {
      const result = await apiClient.getProfile()
      if (result.data) {
        setProfile(result.data)
        setUser({ id: result.data.user_id, email: result.data.email })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const result = await apiClient.signUp(email, password, fullName)
      
      if (result.error) {
        return { error: result.error }
      }

      if (result.data) {
        setUser(result.data.user)
        setSession(result.data.session)
        localStorage.setItem('auth_token', result.data.session.access_token)
        fetchProfile()
      }

      return { error: null }
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const result = await apiClient.signIn(email, password)
      
      if (result.error) {
        return { error: result.error }
      }

      if (result.data) {
        setUser(result.data.user)
        setSession(result.data.session)
        localStorage.setItem('auth_token', result.data.session.access_token)
        fetchProfile()
      }

      return { error: null }
    } catch (error) {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const signOut = async () => {
    setUser(null)
    setProfile(null)
    setSession(null)
    localStorage.removeItem('auth_token')
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: { message: 'No user logged in' } }

    try {
      const result = await apiClient.updateProfile(updates)
      
      if (!result.error) {
        setProfile(prev => prev ? { ...prev, ...updates } : null)
      }

      return result
    } catch (error) {
      return { error: { message: 'Failed to update profile' } }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}