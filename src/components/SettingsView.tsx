import React from 'react'
import { useAuth } from '../hooks'

export const SettingsView: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="bg-rixa-dark rounded-lg p-8 border border-rixa-blue/20">
          <h2 className="text-xl font-semibold text-rixa-cream mb-4">
            Settings Access Required
          </h2>
          <p className="text-rixa-cream/70">
            Please log in to access your settings.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
        <h1 className="text-2xl font-bold text-rixa-cream mb-2">Settings</h1>
        <p className="text-rixa-cream/70">
          Customize your Rixa experience.
        </p>
      </div>

      {/* Account Settings */}
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
        <h3 className="text-lg font-semibold text-rixa-cream mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-rixa-cream">Email Notifications</div>
              <div className="text-sm text-rixa-cream/60">Receive updates via email</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-rixa-blue/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rixa-blue"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-rixa-cream">Private Profile</div>
              <div className="text-sm text-rixa-cream/60">Only followers can see your posts</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-rixa-blue/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rixa-blue"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-blue/20">
        <h3 className="text-lg font-semibold text-rixa-cream mb-4">Privacy & Security</h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 bg-rixa-blue/10 hover:bg-rixa-blue/20 rounded-lg transition-colors">
            <div className="text-rixa-cream">Change Password</div>
            <div className="text-sm text-rixa-cream/60">Update your account password</div>
          </button>
          
          <button className="w-full text-left p-3 bg-rixa-blue/10 hover:bg-rixa-blue/20 rounded-lg transition-colors">
            <div className="text-rixa-cream">Two-Factor Authentication</div>
            <div className="text-sm text-rixa-cream/60">Add an extra layer of security</div>
          </button>
          
          <button className="w-full text-left p-3 bg-rixa-blue/10 hover:bg-rixa-blue/20 rounded-lg transition-colors">
            <div className="text-rixa-cream">Download Your Data</div>
            <div className="text-sm text-rixa-cream/60">Get a copy of your information</div>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rixa-dark rounded-lg p-6 border border-rixa-red/40">
        <h3 className="text-lg font-semibold text-rixa-red mb-4">Danger Zone</h3>
        <button className="px-4 py-2 bg-rixa-red text-white rounded-lg hover:bg-rixa-dark-red transition-colors">
          Delete Account
        </button>
        <p className="text-sm text-rixa-cream/60 mt-2">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
      </div>
    </div>
  )
}