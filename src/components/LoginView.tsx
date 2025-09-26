import React from 'react'
import { LoginForm } from './LoginForm'

export const LoginView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20 text-center">
        <h1 className="text-2xl font-bold text-rixa-cream mb-2">Welcome to Rixa</h1>
        <p className="text-rixa-cream/70">
          Join our community and start connecting with people around the world.
        </p>
      </div>
      
      <LoginForm />

    </div>
  )
}