import { useUser } from '../contexts/UserContext'

export const useProfile = () => {
  const { user, updateUser, error, clearError } = useUser()

  const updateProfile = async (profileData: { displayName?: string; bio?: string; avatar?: string }) => {
    if (!user) return

    try {
      // Here you would make an API call to update the profile
      // For now, we'll just update locally
      updateUser(profileData)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  return {
    user,
    updateProfile,
    error,
    clearError,
  }
}