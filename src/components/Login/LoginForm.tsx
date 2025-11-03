import React, { useState, useEffect } from 'react'
import { useAuth, useUser } from '../../hooks'
import { useToast } from '../../contexts/ToastContext'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading } = useAuth()
  const { error } = useUser()
  const { showError } = useToast()

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      await login(email, password)
    }
  }

  return (
    <div className="bg-rixa-dark rounded-lg shadow-sm border border-rixa-blue/20 p-6 mb-6">
      <h2 className="text-xl font-semibold text-rixa-cream mb-4">Login to Rixa</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-rixa-cream mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:border-rixa-blue text-rixa-cream placeholder-rixa-cream/50"
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-rixa-cream mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:border-rixa-blue text-rixa-cream placeholder-rixa-cream/50"
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full bg-rixa-blue text-white py-2 px-4 rounded-md hover:bg-rixa-blue/90 focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p className="text-sm text-rixa-cream/60 mt-4">
        Dont't have an account?
        <a href="/signup" className="text-rixa-blue hover:underline">
           Sign up 
        </a>
      </p>
    </div>
  )
}