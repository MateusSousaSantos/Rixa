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
      
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
        <h3 className="text-lg font-semibold text-rixa-cream mb-4">Why Join Rixa?</h3>
        <ul className="space-y-2 text-rixa-cream/80">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-rixa-blue rounded-full"></span>
            Connect with friends and family
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-rixa-blue rounded-full"></span>
            Share your thoughts and experiences
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-rixa-blue rounded-full"></span>
            Discover new content and communities
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-rixa-blue rounded-full"></span>
            Stay updated with the latest trends
          </li>
        </ul>
      </div>
    </div>
  )
}