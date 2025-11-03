import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks'
import { registerAuthInterceptor, unregisterAuthInterceptor } from '../utils/authInterceptor'

interface AuthInterceptorProviderProps {
  children: React.ReactNode
}

export const AuthInterceptorProvider: React.FC<AuthInterceptorProviderProps> = ({ children }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    // Register the auth interceptor callbacks
    registerAuthInterceptor({
      onUnauthorized: async () => {
        console.log('🔒 Unauthorized response - logging out and redirecting to login')
        try {
          await logout()
        } catch (error) {
          console.error('Error during automatic logout:', error)
        } finally {
          navigate('/login', { replace: true })
        }
      }
    })

    // Cleanup function to unregister the interceptor
    return () => {
      unregisterAuthInterceptor()
    }
  }, [logout, navigate])

  return <>{children}</>
}