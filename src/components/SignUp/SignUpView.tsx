import React from 'react'
import { SignUpForm } from './SignUpForm'

export const SignUpView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20 text-center">
        <h1 className="text-2xl font-bold text-rixa-cream mb-2">Join RIXA!</h1>
        <p className="text-rixa-cream/70">
          Create your account and start connecting with people around the world.
        </p>
      </div>
      
      <SignUpForm />
    </div>
  )
}