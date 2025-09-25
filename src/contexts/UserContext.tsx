import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { User, AuthState } from '../types/user'

// Action types
type UserAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' }

// Context type
interface UserContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  clearError: () => void
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Reducer
const userReducer = (state: AuthState, action: UserAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  // Mock login function - replace with actual API call
  const login = async (email: string, _password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - replace with actual API response
      const mockUser: User = {
        id: '1',
        username: 'johndoe',
        email: email,
        displayName: 'John Doe',
        avatar: '',
        bio: 'Welcome to Rixa!',
        createdAt: new Date().toISOString(),
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('rixa_user', JSON.stringify(mockUser))
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser })
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      })
    }
  }

  const logout = (): void => {
    localStorage.removeItem('rixa_user')
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (userData: Partial<User>): void => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
    
    // Update localStorage
    if (state.user) {
      const updatedUser = { ...state.user, ...userData }
      localStorage.setItem('rixa_user', JSON.stringify(updatedUser))
    }
  }

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('rixa_user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      } catch (error) {
        localStorage.removeItem('rixa_user')
      }
    }
  }, [])

  const contextValue: UserContextType = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}