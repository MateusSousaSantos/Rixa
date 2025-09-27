import React from 'react'
import { UserProfile } from './UserProfile'
import { useAuth } from '../../hooks'

export const ProfileView: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="bg-rixa-dark rounded-lg p-8 border border-rixa-blue/20">
          <h2 className="text-xl font-semibold text-rixa-cream mb-4">
            Profile Access Required
          </h2>
          <p className="text-rixa-cream/70">
            Please log in to view and edit your profile.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 pt-5 space-y-4 h-full">
      <UserProfile />
    </div>
  )
}