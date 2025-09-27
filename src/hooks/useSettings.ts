import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getUserSettings, 
  updateUserSettings, 
  updateNotificationSettings,
  updatePrivacySettings,
  updateAppearanceSettings,
  resetUserSettings 
} from '../services'
import type { UserSettings } from '../services/settingsService'

// Hook for getting user settings
export const useUserSettings = (userId: string) => {
  return useQuery({
    queryKey: ['userSettings', userId],
    queryFn: () => getUserSettings(userId),
    select: (data) => data.success ? data.data : null,
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for updating user settings
export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, settings }: { userId: string; settings: Partial<UserSettings> }) =>
      updateUserSettings(userId, settings),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Update the cache with new settings
        queryClient.setQueryData(['userSettings', variables.userId], data)
      }
    },
    onError: (error) => {
      console.error('Error updating user settings:', error)
    },
  })
}

// Hook for updating notification settings specifically
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, notifications }: { 
      userId: string; 
      notifications: Partial<UserSettings['notifications']> 
    }) => updateNotificationSettings(userId, notifications),
    onSuccess: (_, variables) => {
      // Invalidate user settings to refetch
      queryClient.invalidateQueries({ queryKey: ['userSettings', variables.userId] })
    },
    onError: (error) => {
      console.error('Error updating notification settings:', error)
    },
  })
}

// Hook for updating privacy settings
export const useUpdatePrivacySettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, privacy }: { 
      userId: string; 
      privacy: Partial<UserSettings['privacy']> 
    }) => updatePrivacySettings(userId, privacy),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userSettings', variables.userId] })
    },
    onError: (error) => {
      console.error('Error updating privacy settings:', error)
    },
  })
}

// Hook for updating appearance settings
export const useUpdateAppearanceSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, appearance }: { 
      userId: string; 
      appearance: Partial<UserSettings['appearance']> 
    }) => updateAppearanceSettings(userId, appearance),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userSettings', variables.userId] })
    },
    onError: (error) => {
      console.error('Error updating appearance settings:', error)
    },
  })
}

// Hook for resetting user settings
export const useResetUserSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userId: string) => resetUserSettings(userId),
    onSuccess: (data, userId) => {
      if (data.success) {
        // Update cache with reset settings
        queryClient.setQueryData(['userSettings', userId], data)
      }
    },
    onError: (error) => {
      console.error('Error resetting user settings:', error)
    },
  })
}