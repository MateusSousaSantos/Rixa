import React, { useState, useEffect, useRef } from 'react'
import { UserProfile } from './UserProfile'
import { useAuth } from '../../hooks'
import { updateProfile, getProfile } from '../../services/userService'
import type { User } from '../../types/user'

export const ProfileView: React.FC = () => {
  const { user: authUser, updateUser } = useAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const hasFetchedRef = useRef(false)

  // Fetch current user data from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUser) {
        setLoading(false)
        return
      }

      // Only fetch if we haven't fetched before for this user
      if (hasFetchedRef.current) {
        setCurrentUser(authUser)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        hasFetchedRef.current = true
        const response = await getProfile()
        
        if (response.success && response.data) {
          // Update local state with fresh data from backend
          setCurrentUser(response.data)
        } else {
          // Fallback to cached user data if backend call fails
          setCurrentUser(authUser)
          console.error('Failed to fetch profile:', response.message)
        }
      } catch (error) {
        // Fallback to cached user data on error
        setCurrentUser(authUser)
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [authUser])

  const handleUserUpdate = async (updatedUserData: Partial<User>) => {
    if (!currentUser) return

    try {
      // Optimistically update local state
      const updatedUser = { ...currentUser, ...updatedUserData }
      setCurrentUser(updatedUser)

      // Update via API
      const response = await updateProfile(updatedUserData)
      
      if (response.success && response.data) {
        // Update both local state and auth context with server response
        setCurrentUser(response.data)
        updateUser(response.data)
      } else {
        // Revert on failure
        setCurrentUser(currentUser)
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      // Revert optimistic update on error
      setCurrentUser(currentUser)
      console.error('Error updating profile:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="p-5 pt-5 space-y-4 h-full">
        <div className="bg-rixa-dark rounded-lg p-8 border border-rixa-blue/20 text-center">
          <div className="text-rixa-cream">Carregando perfil...</div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="p-5 pt-5 space-y-4 h-full">
        <div className="bg-rixa-dark rounded-lg p-8 border border-rixa-blue/20 text-center">
          <h2 className="text-xl font-semibold text-rixa-cream mb-4">
            Acesso ao Perfil Necessário
          </h2>
          <p className="text-rixa-cream/70">
            Faça login para visualizar e editar seu perfil.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 pt-5 space-y-4 h-full">
      <UserProfile 
        profileUser={currentUser}
        isOwnProfile={true}
        onUserUpdate={handleUserUpdate}
      />
    </div>
  )
}