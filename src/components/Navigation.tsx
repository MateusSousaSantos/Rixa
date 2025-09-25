import React from 'react'
import { FiHome, FiUser, FiSettings, FiLogIn } from 'react-icons/fi'
import { useAuth } from '../hooks'

export type NavigationView = 'home' | 'profile' | 'settings' | 'login'

interface NavigationProps {
  currentView: NavigationView
  onViewChange: (view: NavigationView) => void
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const { isAuthenticated } = useAuth()

  const navItems = [
    {
      id: 'home' as NavigationView,
      label: 'Home',
      icon: FiHome,
      public: true
    },
    {
      id: 'profile' as NavigationView,
      label: 'Profile',
      icon: FiUser,
      public: false
    },
    {
      id: 'settings' as NavigationView,
      label: 'Settings',
      icon: FiSettings,
      public: false
    }
  ]

  const availableItems = navItems.filter(item => item.public || isAuthenticated)

  return (
    <nav className="bg-rixa-dark border-r border-rixa-blue/20 w-64 h-full overflow-y-auto">
      <div className="p-4">
        <div className="space-y-2">
          {availableItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  currentView === item.id
                    ? 'bg-rixa-blue text-white'
                    : 'text-rixa-cream/80 hover:text-rixa-cream hover:bg-rixa-blue/20'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}

          {/* Login button for unauthenticated users */}
          {!isAuthenticated && (
            <button
              onClick={() => onViewChange('login')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                currentView === 'login'
                  ? 'bg-rixa-blue text-white'
                  : 'text-rixa-cream/80 hover:text-rixa-cream hover:bg-rixa-blue/20'
              }`}
            >
              <FiLogIn size={20} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}