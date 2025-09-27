import React, { useState } from 'react'
import { useAuth, useUser } from '../../hooks'

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })
  const { signup, isLoading } = useAuth()
  const { error } = useUser()
  const [passwordError, setPasswordError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear password error when user types
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('As senhas não coincidem')
      return
    }
    
    if (formData.password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres')
      return
    }
    
    if (formData.username && formData.email && formData.password && formData.displayName) {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName
      })
    }
  }

  return (
    <div className="bg-rixa-dark rounded-lg shadow-sm border border-rixa-blue/20 p-6 mb-6">
      <h2 className="text-xl font-semibold text-rixa-cream mb-4">Criar Conta no Rixa</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-rixa-cream mb-1">
            Nome completo
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:border-rixa-blue text-rixa-cream placeholder-rixa-cream/50"
            placeholder="Seu nome completo"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-rixa-cream mb-1">
            Nome de usuário
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:border-rixa-blue text-rixa-cream placeholder-rixa-cream/50"
            placeholder="Escolha um nome de usuário"
            disabled={isLoading}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-rixa-cream mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:border-rixa-blue text-rixa-cream placeholder-rixa-cream/50"
            placeholder="Seu email"
            disabled={isLoading}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-rixa-cream mb-1">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:border-rixa-blue text-rixa-cream placeholder-rixa-cream/50"
            placeholder="Crie uma senha"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-rixa-cream mb-1">
            Confirmar senha
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-rixa-dark-shadow border border-rixa-blue/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:border-rixa-blue text-rixa-cream placeholder-rixa-cream/50"
            placeholder="Confirme sua senha"
            disabled={isLoading}
            required
          />
        </div>

        {(error || passwordError) && (
          <div className="text-rixa-red text-sm">
            {error || passwordError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !formData.username || !formData.email || !formData.password || !formData.displayName}
          className="w-full bg-rixa-blue text-white py-2 px-4 rounded-md hover:bg-rixa-blue/90 focus:outline-none focus:ring-2 focus:ring-rixa-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
      
      <p className="text-sm text-rixa-cream/60 mt-4">
        Já tem uma conta? Faça login para continuar.
      </p>
    </div>
  )
}