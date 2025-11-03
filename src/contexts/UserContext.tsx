import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { User, AuthState } from '../types/user'
import * as userService from '../services/userService'

// Action types
type UserAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' }
  | { type: 'REGISTER_START' } 
  | { type: 'REGISTER_FAILURE'; payload: string }

// Context type - ATUALIZADO
interface UserContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (name: string, username: string, email: string, password: string) => Promise<void> 
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
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
    case 'REGISTER_START': 
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
    case 'REGISTER_FAILURE':
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

  // Updated login function using service 
  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      const response = await userService.login(email, password)
      
      if (response.success) {
        // Store token and user in localStorage for persistence
        if(response.data){
          localStorage.setItem('rixa_token', response.data.token || "")
          localStorage.setItem('rixa_user', JSON.stringify(response.data.user))
          dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user })
        }
      } else {
        dispatch({ 
          type: 'LOGIN_FAILURE', 
          payload: response.message || 'Falha no login' 
        })
      }
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Falha no login' 
      })
    }
  }

  // FUNÇÃO DE REGISTRO ATUALIZADA - 4 PARÂMETROS
  const register = async (name: string, username: string, email: string, password: string): Promise<void> => {
    dispatch({ type: 'REGISTER_START' })
    
    try {
      console.log('📤 UserContext.register chamado com:', { name, username, email, password })
      const response = await userService.register(name, username, email, password)
      console.log('📥 UserContext - Resposta do userService:', response)
      
      if (response.success) {
        console.log('✅ UserContext: Registro bem-sucedido, fazendo login...')
        // Se o registro foi bem sucedido, faz login automaticamente
        await login(email, password)
      } else {
        console.log('❌ UserContext: Registro falhou:', response.message)
        dispatch({ 
          type: 'REGISTER_FAILURE', 
          payload: response.message || 'Falha no registro' 
        })
      }
    } catch (error) {
      console.error('💥 UserContext: Erro no register:', error)
      dispatch({ 
        type: 'REGISTER_FAILURE', 
        payload: error instanceof Error ? error.message : 'Falha no registro' 
      })
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await userService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('rixa_token')
      localStorage.removeItem('rixa_user')
      dispatch({ type: 'LOGOUT' })
    }
  }

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!state.user) return
    
    try {
      const response = await userService.updateProfile(userData)
      
      if (response.success) {
        dispatch({ type: 'UPDATE_USER', payload: userData })
        
        // Update localStorage
        localStorage.setItem('rixa_user', JSON.stringify(response.data))
      }
    } catch (error) {
      console.error('Update user error:', error)
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
      } catch {
      localStorage.removeItem('rixa_user')
      }
    }
  }, [])

  const contextValue: UserContextType = {
    ...state,
    login,
    register, 
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

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}