import React from 'react'
import { UserProfile } from './UserProfile'
import { useAuth } from '../hooks'

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
    <div className="space-y-6">
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
        <h1 className="text-2xl font-bold text-rixa-cream mb-2">Your Profile</h1>
        <p className="text-rixa-cream/70">
          Manage your personal information and preferences.
        </p>
      </div>
      
      <UserProfile />
      
      {/* Additional Profile Sections */}
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
        <h3 className="text-lg font-semibold text-rixa-cream mb-4">Account Statistics</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-rixa-blue">12</div>
            <div className="text-sm text-rixa-cream/70">Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-rixa-blue">48</div>
            <div className="text-sm text-rixa-cream/70">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-rixa-blue">73</div>
            <div className="text-sm text-rixa-cream/70">Following</div>
          </div>
        </div>
      </div>
    </div>
  )
}